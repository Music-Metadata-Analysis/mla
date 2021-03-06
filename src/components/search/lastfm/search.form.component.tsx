import { Flex, FormControl, FormLabel } from "@chakra-ui/react";
import {
  Formik,
  Form,
  Field,
  FieldInputProps,
  FormikProps,
  FormikHelpers,
} from "formik";
import StyledButton from "../../button/button.standard/button.standard.component";
import StyledInput from "../common/input/input.component";
import type { LastFMUserSearchInterface } from "../../../types/search/lastfm/search";
import type { TFunction } from "next-i18next";

interface SearchFormProps {
  t: TFunction;
  validateUserName: (username: string) => string | undefined;
  handleSubmit: (
    values: LastFMUserSearchInterface,
    actions: FormikHelpers<LastFMUserSearchInterface>
  ) => void;
}

export default function SearchForm({
  t,
  validateUserName,
  handleSubmit,
}: SearchFormProps) {
  return (
    <Formik
      initialValues={{ username: "" }}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={false}
    >
      {({ isSubmitting }) => (
        <Form>
          <Flex justify={"center"} maxWidth={"700px"}>
            <Field name="username" validate={validateUserName}>
              {({
                field,
                form,
              }: {
                field: FieldInputProps<LastFMUserSearchInterface["username"]>;
                form: FormikProps<LastFMUserSearchInterface>;
              }) => (
                <FormControl isInvalid={form.errors.username !== undefined}>
                  <FormLabel id={"username.label"} htmlFor="username">
                    {t("search.fieldLabel")}
                  </FormLabel>
                  <StyledInput
                    {...field}
                    id="username"
                    placeholder={t("search.fieldPlaceholder")}
                    maxWidth={"700px"}
                  />
                </FormControl>
              )}
            </Field>
            <StyledButton
              width={["50px", "100px", "100px"]}
              analyticsName="Search: last.fm"
              mb={12}
              mt={8}
              ml={3}
              isLoading={isSubmitting}
              type="submit"
            >
              {t("search.buttonText")}
            </StyledButton>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
