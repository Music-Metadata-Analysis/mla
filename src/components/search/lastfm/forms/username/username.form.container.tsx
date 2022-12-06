import { useEffect } from "react";
import UserNameForm from "./username.form.component";
import lastfmSettings from "@src/config/lastfm";
import useAuth from "@src/hooks/auth.hook";
import useFormsController from "@src/hooks/controllers/forms.controller.hook";
import useLocale from "@src/hooks/locale.hook";
import useRouter from "@src/hooks/router";
import type { LastFMUserSearchInterface } from "@src/types/search/lastfm/search";
import type { FormikHelpers } from "formik";

interface UserNameFormContainerProps {
  route: string;
}

export default function UserNameFormContainer({
  route,
}: UserNameFormContainerProps) {
  const { error } = useFormsController();
  const { t } = useLocale("lastfm");
  const { user: authSession, status: authStatus } = useAuth();
  const router = useRouter();

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
      error.open("username", t("search.errors.username.required"));
      return t("search.errors.username.required");
    }
    if (
      value.length > lastfmSettings.search.maxUserLength ||
      value.length < lastfmSettings.search.minUserLength
    ) {
      error.open("username", t("search.errors.username.valid"));
      return t("search.errors.username.valid");
    }
    error.close("username");
    return undefined;
  };

  const handleSubmit = (
    values: LastFMUserSearchInterface,
    actions: FormikHelpers<LastFMUserSearchInterface>
  ) => {
    if (!authSession && authStatus === "unauthenticated") {
      actions.setSubmitting(false);
      error.open("session", t("search.errors.session.notLoggedIn"));
      return;
    }
    const params = {
      username: values.username,
    };
    const query = new URLSearchParams(params);
    router.push(`${route}?${query.toString()}`);
  };

  return (
    <UserNameForm
      handleSubmit={handleSubmit}
      placeHolderText={t("search.fieldPlaceholder")}
      submitButtonText={t("search.buttonText")}
      validateUserName={validateUserName}
    />
  );
}
