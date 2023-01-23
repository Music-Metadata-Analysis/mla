import { useEffect } from "react";
import UserNameForm from "./username.form.component";
import { ids, fields } from "./username.form.identifiers";
import lastfmSettings from "@src/config/lastfm";
import useFormsController from "@src/hooks/controllers/forms.controller.hook";
import useAuth from "@src/web/authentication/session/hooks/auth.hook";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import useRouter from "@src/web/navigation/routing/hooks/router.hook";
import type { LastFMUserSearchInterface } from "@src/types/search/lastfm/search";
import type { FormikHelpers } from "formik";

interface UserNameFormContainerProps {
  route: string;
}

export default function UserNameFormContainer({
  route,
}: UserNameFormContainerProps) {
  const { error } = useFormsController();
  const { t } = useTranslation("lastfm");
  const { user: authSession, status: authStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authSession) {
      const element = document.querySelector(
        `[id="${ids.username}"]`
      ) as HTMLInputElement;
      element.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authSession]);

  const validateUserName = (value: string) => {
    if (!value) {
      error.open(
        fields.username,
        t(`search.errors.${fields.username}.required`)
      );
      return t(`search.errors.${fields.username}.required`);
    }
    if (
      value.length > lastfmSettings.search.maxUserLength ||
      value.length < lastfmSettings.search.minUserLength
    ) {
      error.open(fields.username, t(`search.errors.${fields.username}.valid`));
      return t(`search.errors.${fields.username}.valid`);
    }
    error.close(fields.username);
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
      [fields.username]: values.username,
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
