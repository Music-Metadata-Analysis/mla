import { Flex, FormControl } from "@chakra-ui/react";
import {
  Formik,
  Form,
  Field,
  FieldInputProps,
  FormikProps,
  FormikHelpers,
} from "formik";
import { ids, fields } from "./username.form.identifiers";
import StyledInput from "@src/web/forms/generics/components/input/input.component";
import StyledButton from "@src/web/ui/generics/components/buttons/button.standard/button.standard.component";
import type { LastFMUserSearchInterface } from "@src/web/forms/lastfm/types/username.form.types";

interface UserNameFormProps {
  handleSubmit: (
    values: LastFMUserSearchInterface,
    actions: FormikHelpers<LastFMUserSearchInterface>
  ) => void;
  placeHolderText: string;
  submitButtonText: string;
  validateUserName: (username: string) => string | undefined;
}

export default function UserNameForm({
  handleSubmit,
  placeHolderText,
  submitButtonText,
  validateUserName,
}: UserNameFormProps) {
  return (
    <Formik
      initialValues={{ [fields.username]: "" }}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={false}
    >
      {({ isSubmitting }) => (
        <Form>
          <Flex flexDirection={"column"} justify={"center"}>
            <Field name={fields.username} validate={validateUserName}>
              {({
                field,
                form,
              }: {
                field: FieldInputProps<
                  LastFMUserSearchInterface[typeof fields.username]
                >;
                form: FormikProps<LastFMUserSearchInterface>;
              }) => (
                <FormControl isInvalid={form.errors.username !== undefined}>
                  <StyledInput
                    {...field}
                    id={ids.username}
                    placeholder={placeHolderText}
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
                {submitButtonText}
              </StyledButton>
            </Flex>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
