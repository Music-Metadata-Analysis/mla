import { useEffect } from "react";
import SearchForm from "./search.form";
import settings from "@src/config/lastfm";
import useAuth from "@src/hooks/auth";
import useNavBarLayoutController from "@src/hooks/controllers/navbar.controller.hook";
import useRouter from "@src/hooks/router";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { LastFMUserSearchInterface } from "@src/types/search/lastfm/search";
import type { FormikHelpers } from "formik";

interface SearchContainerProps {
  route: string;
  closeError: (fieldName: string) => void;
  openError: (fieldName: string, message: string) => void;
  t: tFunctionType;
}

export default function SearchContainer({
  route,
  closeError,
  openError,
  t,
}: SearchContainerProps) {
  const { user: authSession, status: authStatus } = useAuth();
  const navBar = useNavBarLayoutController();
  const router = useRouter();

  useEffect(() => {
    navBar.navigation.setFalse();
    window.addEventListener("resize", navBar.navigation.setFalse);
    return () => {
      window.removeEventListener("resize", navBar.navigation.setFalse);
      navBar.navigation.setTrue();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authSession) {
      const element = document.querySelector(
        '[id="username"]'
      ) as HTMLInputElement;
      element.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authSession]);

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
    values: LastFMUserSearchInterface,
    actions: FormikHelpers<LastFMUserSearchInterface>
  ) => {
    if (!authSession && authStatus === "unauthenticated") {
      actions.setSubmitting(false);
      openError("session", t("search.errors.session.notLoggedIn"));
      return;
    }
    const params = {
      username: values.username,
    };
    const query = new URLSearchParams(params);
    router.push(`${route}?${query.toString()}`);
  };

  return (
    <SearchForm
      t={t}
      validateUserName={validateUserName}
      handleSubmit={handleSubmit}
    />
  );
}
