import { useCallback, useEffect, useRef, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import {
  Backdrop,
  Box,
  debounce,
  Portal,
  Stack,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { isEmpty, get, sortBy } from "lodash-es";

import { Spinner } from "./Spinner";
import { useClaims } from "modules/claims/hooks/useClaims";
import { ClaimProps } from "modules/claims/interfaces";
import { ClaimsList } from "modules/claims/components/ClaimsList";
import { ClassNames } from "@emotion/react";
import { Container } from "@mui/material";

const SearchInput = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
  },
  flexGrow: 1,
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
  "& .MuiInputBase-input::placeholder": {
    opacity: 0.9,
  },
}));

const limit = 10;

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { searchClaims } = useClaims();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([] as ClaimProps[]);
  const { enqueueSnackbar } = useSnackbar();
  const searchInputEl = useRef();

  const sortResults = (results: ClaimProps[]) =>
    sortBy(results, ["relevance"]).reverse();
  const handleFocus = () => {
    setShowResults(true);
    document.body.style.overflowY = "hidden";
    document.body.style.position = "fixed";
  };
  const handleBlur = () => {
    setTimeout(() => {
      setShowResults(false);
      document.body.style.overflowY = "overlay";
      document.body.style.position = "initial";
    }, 0);
  };
  const handleKeyDown = (event: KeyboardEvent<any>) => {
    if (event.key === "Escape" && searchInputEl.current) {
      return searchInputEl.current.querySelector("input").blur();
    }
  };
  const handleSearch = async (event: InputEvent) => {
    const term = event?.target?.value;

    setIsLoading(true);
    setSearchTerm(term);
    setOffset(0);
    setTotalCount(0);

    if (isEmpty(term)) {
      setIsLoading(false);
      setSearchResults([]);
      return;
    }

    try {
      const searchedClaims = await searchClaims({ term, limit, offset: 0 });
      setTotalCount(searchedClaims.totalCount);
      setSearchResults(sortResults(searchedClaims.data));
    } catch (e: any) {
      enqueueSnackbar(e?.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  const handleFetchMore = async () => {
    if (totalCount <= offset + limit || isLoadingMore || isLoading) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const updatedOffset = offset + limit;
      setOffset(offset + limit);
      const moreSearchedClaims = await searchClaims({
        term: searchTerm,
        limit,
        offset: updatedOffset,
      });
      setSearchResults([
        ...searchResults,
        ...sortResults(moreSearchedClaims.data),
      ]);
      setTotalCount(moreSearchedClaims.totalCount);
    } catch (e: any) {
      enqueueSnackbar(e?.message, { variant: "error" });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const getBackdropContent = () => {
    if (isEmpty(searchResults) && isLoading === false) {
      if (isEmpty(searchTerm)) {
        return null;
      } else {
        return (
          <Typography
            variant="h5"
            color="primaryContrast"
            align="center"
            sx={{ marginTop: 5 }}
          >
            No results for &quot;{searchTerm}&quot;
          </Typography>
        );
      }
    } else {
      return (
        <Stack spacing={3}>
          {isLoading === false ? (
            <Typography variant="h5">
              Found {totalCount} result
              {searchResults.length === 1 ? "" : "s"} for &quot;{searchTerm}
              &quot;
            </Typography>
          ) : null}
          <ClaimsList
            claims={searchResults}
            loading={isLoading}
            loadingMore={isLoadingMore}
            handleFetchMore={handleFetchMore}
            spinnerColor="primaryContrast"
          />
        </Stack>
      );
    }
  };

  return (
    <>
      <SearchInput>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search claims…"
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onInput={debounce((event) => {
            handleSearch(event);
          }, 300)}
          onBlur={handleBlur}
          ref={searchInputEl}
          inputProps={{ "aria-label": "search" }}
        />
      </SearchInput>
      <Portal>
        <Backdrop
          sx={{
            color: "#fff",
            display: "initial",
            zIndex: 2,
            overflowY: "auto",
          }}
          open={showResults}
          onClick={handleBlur}
        >
          <Container className="page">{getBackdropContent()}</Container>
        </Backdrop>
      </Portal>
    </>
  );
};
