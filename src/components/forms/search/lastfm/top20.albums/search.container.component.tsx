import { useRouter } from "next/router";
import { useEffect } from "react";
import SearchForm from "./search.form.component";
import settings from "../../../../../config/lastfm";
import routes from "../../../../../config/routes";
import useNavBar from "../../../../../hooks/navbar";
import type { LastFMTop20AlbumsSearchFormInterface } from "../../../../../types/forms/lastfm/search";
import type { FormikHelpers } from "formik";
import type { TFunction } from "next-i18next";

interface SearchContainerProps {
  closeError: (fieldName: string) => void;
  openError: (fieldName: string, message: string) => void;
  t: TFunction;
}

export default function SearchContainer({
  closeError,
  openError,
  t,
}: SearchContainerProps) {
  const router = useRouter();
  const { hideNavBar, showNavBar } = useNavBar();

  useEffect(() => {
    hideNavBar();
    window.addEventListener("resize", hideNavBar);
    return () => {
      window.removeEventListener("resize", hideNavBar);
      showNavBar();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateUserName = (value: string) => {
    if (!value) {
      openError("username", t("search.errors.username.required"));
      return t("search.errors.username.required");
    }
    if (
      value.length > settings.search.maxUserLength ||
      value.length < settings.search.minUserLength
    ) {
      openError("username", t("search.errors.username.valid"));
      return t("search.errors.username.valid");
    }
    closeError("username");
    return undefined;
  };

  const handleSubmit = (
    values: LastFMTop20AlbumsSearchFormInterface,
    actions: FormikHelpers<LastFMTop20AlbumsSearchFormInterface>
  ) => {
    actions.setSubmitting(true);
    const params = {
      username: values.username,
    };
    const query = new URLSearchParams(params);
    router.push(`${routes.lastfm.top20albums}?${query.toString()}`);
  };

  return (
    <SearchForm
      t={t}
      validateUserName={validateUserName}
      handleSubmit={handleSubmit}
    />
  );
}
