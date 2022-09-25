import { Flex, FormControl } from "@chakra-ui/react";
import {
  Formik,
  Form,
  Field,
  FieldInputProps,
  FormikProps,
  FormikHelpers,
} from "formik";
import StyledInput from "../common/input/input.component";
import StyledButton from "@src/components/button/button.standard/button.standard.component";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { LastFMUserSearchInterface } from "@src/types/search/lastfm/search";

interface SearchFormProps {
  t: tFunctionType;
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
          <Flex flexDirection={"column"} justify={"center"}>
            <Field name="username" validate={validateUserName}>
              {({
                field,
                form,
              }: {
                field: FieldInputProps<LastFMUserSearchInterface["username"]>;
                form: FormikProps<LastFMUserSearchInterface>;
              }) => (
                <FormControl isInvalid={form.errors.username !== undefined}>
                  <StyledInput
                    {...field}
                    id="username"
                    placeholder={t("search.fieldPlaceholder")}
                    width={["150px", "300px", "400px", "500px"]}
                  />
                </FormControl>
              )}
            </Field>
            <Flex align={"center"} justifyContent={"flex-end"}>
              <StyledButton
                analyticsName="Search: last.fm"
                isLoading={isSubmitting}
                ml={3}
                mt={2}
                type="submit"
                width={["50px", "100px", "100px"]}
              >
                {t("search.buttonText")}
              </StyledButton>
            </Flex>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
