/*
 * Built by Consider.it (https://consider.it/)
 */

import d3 from "d3";

import { OpinionProps } from "modules/claims/interfaces";

export function normalizeAcceptance(opinions: OpinionProps[]) {
  return (
    opinions?.map((opinion) => {
      const { acceptance } = opinion;

      return {
        ...opinion,
        acceptance:
          acceptance >= 0.5 ? (acceptance - 0.5) * 2 : -(0.5 - acceptance) * 2,
      };
    }) || []
  );
}

export function positionAvatars(
  opinions: OpinionProps[],
  width: number,
  height: number
) {
  opinions = normalizeAcceptance(opinions);

  // Check if system energy would be reduced if two nodes' positions would
  // be swapped. We square the difference in order to favor large differences
  // for one vs small differences for the pair.

  const energyReducedBySwap = (p1, p2) => {
    // How much does each point covet the other's location, over their own?
    const p1Jealousy =
      (p1.x - p1.x_target) * (p1.x - p1.x_target) -
      (p2.x - p1.x_target) * (p2.x - p1.x_target);

    const p2Jealousy =
      (p2.x - p2.x_target) * (p2.x - p2.x_target) -
      (p1.x - p2.x_target) * (p1.x - p2.x_target);

    return p1Jealousy + p2Jealousy;
  };

  // Swaps the positions of two avatars
  const swapPosition = (p1, p2) => {
    const swapX = p1.x;
    const swapY = p1.y;

    p1.x = p2.x;
    p1.y = p2.y;
    p2.x = swapX;
    p2.y = swapY;

    return p2.y;
  };

  // One iteration of the simulation
  const tick = (alpha) => {
    let stable = true;

    // ###
    // Repel colliding nodes
    // A quadtree helps efficiently detect collisions

    const quadtree = d3.geom.quadtree(nodes);

    for (const node of nodes) {
      quadtree.visit(collide(node, alpha));
    }

    for (const node of nodes) {
      node.px = node.x;
      node.py = node.y;

      // Push node toward its desired x-position
      node.x += alpha * (xForceMult * width * 0.001) * (node.xTarget - node.x);

      // Push node downwards
      node.y += alpha * yForceMult;

      // Ensure node is still within the bounding box
      if (node.x < node.radius) {
        node.x = node.radius;
      } else if (node.x > width - node.radius) {
        node.x = width - node.radius;
      }

      if (node.y < node.radius) {
        node.y = node.radius;
      } else if (node.y > height - node.radius) {
        node.y = height - node.radius;
      }

      const dx = Math.abs(node.py - node.y);
      const dy = Math.abs(node.px - node.x) > 0.1;

      if (stable && Math.sqrt(dx * dx + dy * dy) > 1) {
        stable = false;
      }
    }

    // Complete the simulation if we've reached a steady state
    return stable;
  };

  const collide = (p1) => (quad, x1, y1, x2, y2) => {
    const p2 = quad.point;

    if (quad.leaf && p2 && p2 !== p1) {
      const dx = Math.abs(p1.x - p2.x);
      const dy = Math.abs(p1.y - p2.y);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const combinedR = p1.radius + p2.radius;

      // Transpose two points in the same neighborhood if it would reduce
      // energy of system
      if (energyReducedBySwap(p1, p2) > 0) {
        swapPosition(p1, p2);
      }

      // Repel both points equally in opposite directions if they overlap

      if (dist < combinedR) {
        const separateBy = dist === 0 ? 1 : (combinedR - dist) / combinedR;
        const offsetX = (combinedR - dx) * separateBy;
        const offsetY = (combinedR - dy) * separateBy;

        if (p1.x < p2.x) {
          p1.x -= offsetX / 2;
          p2.x += offsetX / 2;
        } else {
          p2.x -= offsetX / 2;
          p1.x += offsetX / 2;
        }

        if (p1.y < p2.y) {
          p1.y -= offsetY / 2;
          p2.y += offsetY / 2;
        } else {
          p2.y -= offsetY / 2;
          p1.y += offsetY / 2;
        }
      }
    }

    // Visit subregions if we could possibly have a collision there
    const neighborhoodRadius = p1.radius;
    const nx1 = p1.x - neighborhoodRadius;
    const nx2 = p1.x + neighborhoodRadius;
    const ny1 = p1.y - neighborhoodRadius;
    const ny2 = p1.y + neighborhoodRadius;

    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };

  // #############
  // Initialize positions of each node

  const targets = [];
  const r = calculateAvatarRadius(opinions, width, height);

  const nodes = opinions.map((opinion, i) => {
    let xTarget = ((opinion.acceptance + 1) / 2) * width;

    if (targets[xTarget]) {
      if (xTarget > 0.98) {
        xTarget -= 0.1 * Math.random();
      } else if (xTarget < 0.02) {
        xTarget += 0.1 * Math.random();
      }
    }

    targets[xTarget] = 1;

    const x = xTarget;
    const y = height - r;

    return {
      index: i,
      radius: r,
      x,
      y,
      xTarget,
      opinion,
    };
  });

  // ##########
  // run the simulation

  let stable = false;
  let alpha = 0.8;
  const decay = 0.8;
  const minAlpha = 0.0000001;
  const xForceMult = 2;
  const yForceMult = 2;

  for (let totalTicks = 0; !stable; totalTicks++) {
    stable = tick(alpha);
    alpha *= decay;
    stable = alpha <= minAlpha;
  }

  for (const i in nodes) {
    nodes[i].x = Math.round((nodes[i].x - nodes[i].radius) * 10) / 10;
    nodes[i].y = Math.round((nodes[i].y - nodes[i].radius) * 10) / 10;
  }

  return nodes;
}

const calculateAvatarRadius = (opinions, width, height) => {
  let cnt;
  let o;
  let r;

  opinions.sort((a, b) => a.acceptance - b.acceptance);

  // First, calculate a moving average of the number of opinions
  // across around all possible stances

  const windowSize = 0.3;
  const avgInc = 0.01;
  const movingAvg = [];
  let idx = 0;
  let stance = -1;
  let sum = 0;

  while (stance <= 1) {
    o = idx;
    cnt = 0;

    while (o < opinions.length) {
      if (opinions[o].acceptance < stance - windowSize) {
        idx = o;
      } else if (opinions[o].acceptance > stance + windowSize) {
        break;
      } else {
        cnt += 1;
      }

      o += 1;
    }

    movingAvg.push(cnt);
    stance += avgInc;
    sum += cnt;
  }

  // Second, calculate the densest area of opinions, operationalized
  // as the region with the most opinions amongst all regions of
  // opinion space that have contiguous above average opinions.

  const denseRegions = [];
  const avgOfMovingAvg = sum / movingAvg.length;

  let currentRegion = [];

  for (const idx in movingAvg) {
    const avg = movingAvg[idx];
    let reset = idx === movingAvg.length - 1;

    if (avg >= avgOfMovingAvg) {
      currentRegion.push(idx);
    } else {
      reset = true;
    }

    if (reset && currentRegion.length > 0) {
      denseRegions.push([
        currentRegion[0] * avgInc - 1 - windowSize,
        idx * avgInc - 1 + windowSize,
      ]);

      currentRegion = [];
    }
  }

  let maxRegion = null;
  let maxOpinions = 0;

  for (const region of denseRegions) {
    cnt = 0;
    for (const opinion of opinions) {
      if (opinion.acceptance >= region[0] && opinion.acceptance <= region[1]) {
        cnt += 1;
      }
    }

    if (cnt > maxOpinions) {
      maxOpinions = cnt;
      maxRegion = region;
    }
  }

  // Third, calculate the avatar radius we'll use. It is based on
  // trying to fill ratioFilled of the densest area of the histogram

  const ratioFilled = 0.1;

  if (maxOpinions > 0) {
    const effectiveWidth = (width * Math.abs(maxRegion[0] - maxRegion[1])) / 2;
    const areaPerAvatar = (ratioFilled * effectiveWidth * height) / maxOpinions;
    r = Math.sqrt(areaPerAvatar) / 2;
  } else {
    r = Math.sqrt(((width * height) / opinions.length) * ratioFilled) / 2;
  }

  r = Math.min(r, width / 2, height / 2);

  return r;
};
