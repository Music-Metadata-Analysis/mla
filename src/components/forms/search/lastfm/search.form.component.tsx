import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import {
  Formik,
  Form,
  Field,
  FieldInputProps,
  FormikProps,
  FormikHelpers,
} from "formik";
import { useRef, useEffect } from "react";
import AnalyticsWrapper from "../../../analytics/analytics.component";
import type { LastFMTop20SearchFormInterface } from "../../../../types/forms/lastfm/search";
import type { TFunction } from "next-i18next";

interface SearchFormProps {
  t: TFunction;
  validateUserName: (username: string) => string | undefined;
  handleSubmit: (
    values: LastFMTop20SearchFormInterface,
    actions: FormikHelpers<LastFMTop20SearchFormInterface>
  ) => void;
}

export default function SearchForm({
  t,
  validateUserName,
  handleSubmit,
}: SearchFormProps) {
  const inputFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    /* istanbul ignore else */
    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  }, [inputFieldRef]);

  return (
    <Formik
      initialValues={{ username: "" }}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={false}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="username" validate={validateUserName}>
            {({
              field,
              form,
            }: {
              field: FieldInputProps<
                LastFMTop20SearchFormInterface["username"]
              >;
              form: FormikProps<LastFMTop20SearchFormInterface>;
            }) => (
              <FormControl isInvalid={form.errors.username !== undefined}>
                <FormLabel id={"username.label"} htmlFor="username">
                  {t("search.fieldLabel")}
                </FormLabel>
                <Input
                  ref={inputFieldRef}
                  data-testid="username.input"
                  {...field}
                  id="username"
                  placeholder={t("search.fieldPlaceholder")}
                />
              </FormControl>
            )}
          </Field>
          <AnalyticsWrapper buttonName="Search: last.fm">
            <Button mb={2} mt={4} isLoading={isSubmitting} type="submit">
              {t("search.buttonText")}
            </Button>
          </AnalyticsWrapper>
        </Form>
      )}
    </Formik>
  );
}
