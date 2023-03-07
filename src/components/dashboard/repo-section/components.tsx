/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FormikConfig, FormikHelpers, useFormik } from "formik";
import { FaGithub } from "react-icons/fa";
import {
  MdArrowRightAlt,
  MdLockOutline,
  MdOutlineArrowBackIos,
} from "react-icons/md";
import { useDashboard } from "../provider";

export type ConfigurationFormValues = {
  from: string[];
  until?: string;
};

const HeaderContent = ({
  heading,
  caption,
}: {
  heading: string;
  caption: string;
}) => {
  return (
    <Stack spacing="0">
      <Heading lineHeight="unset" fontSize="1.5rem">
        {heading}
      </Heading>
      <Text fontSize="0.875rem" color="gray.500">
        {caption}
      </Text>
    </Stack>
  );
};

const Header = () => {
  const { setSection } = useDashboard();
  return (
    <Stack width="100%" spacing="1rem" alignItems="flex-start">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setSection(0)}
        leftIcon={<MdOutlineArrowBackIos />}
      >
        Back
      </Button>
      <HeaderContent
        heading="You're almost done"
        caption="Please follow the steps to generate your product update copy."
      />
    </Stack>
  );
};

const RepoInformation = () => {
  const { selectedRepo } = useDashboard();

  return (
    <Stack>
      <Text
        fontWeight="600"
        color="gray.600"
        fontSize="0.75rem"
        lineHeight="unset"
        textTransform="uppercase"
      >
        git repository
      </Text>
      <Link href={selectedRepo.clone_url} target="_blank">
        <Stack isInline alignItems="center" spacing="0.25rem">
          <FaGithub />
          <Text
            width="90%"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {selectedRepo.clone_url}
          </Text>
        </Stack>
      </Link>
    </Stack>
  );
};

const ConfigurationForm = ({
  onSubmit,
}: {
  onSubmit: FormikConfig<ConfigurationFormValues>["onSubmit"];
}) => {
  const { values, setFieldValue, handleSubmit, handleChange, isSubmitting } =
    useFormik<ConfigurationFormValues>({
      onSubmit,
      initialValues: {
        from: ["commit"],
        until: undefined,
      },
    });

  return (
    <Box
      as="form"
      //@ts-ignore
      onSubmit={handleSubmit}
    >
      <Stack spacing="1.5rem" alignItems="flex-start">
        <FormControl width={["100%", "100%", "49%"]}>
          <FormLabel color="gray.600">Generate content from</FormLabel>
          <CheckboxGroup
            colorScheme="green"
            value={values.from}
            onChange={(value) => setFieldValue("from", value)}
          >
            <Stack spacing={[1, 5]} direction={["column", "row"]}>
              <Checkbox value="commit">Commit messages</Checkbox>
              <Checkbox value="pr">Pull requests</Checkbox>
            </Stack>
          </CheckboxGroup>
        </FormControl>
        {values?.from?.includes("commit") && (
          <FormControl width={["100%", "100%", "49%"]}>
            <FormLabel color="gray.600">Commits duration</FormLabel>
            <Input
              size="sm"
              name="until"
              type="date"
              value={values.until}
              onChange={handleChange}
            />
            <FormHelperText color="gray.500" fontSize="0.75rem">
              Only commits before this date will be used
            </FormHelperText>
          </FormControl>
        )}
        <Button
          size="sm"
          type="submit"
          colorScheme="green"
          isLoading={isSubmitting}
          isDisabled={!values.from.length}
        >
          Generate Content
        </Button>
      </Stack>
    </Box>
  );
};

const LeftSection = () => {
  const { selectedRepo, setSection } = useDashboard();

  return (
    <Stack spacing="2rem" width={["100%", "100%", "24%"]}>
      <Stack
        isInline
        p="1rem"
        rounded="8px"
        bg="gray.200"
        fontWeight="500"
        alignItems="center"
        justifyContent="center"
      >
        <FaGithub />
        <Text>{selectedRepo.name}</Text>
        {selectedRepo.visibility === "private" && <MdLockOutline />}
      </Stack>
      <Divider />
      <RepoInformation />
      <Divider />
      <Button
        size="sm"
        variant="link"
        alignItems="flex-start"
        onClick={() => setSection(0)}
        rightIcon={<MdArrowRightAlt />}
      >
        Import a different Git repository
      </Button>
    </Stack>
  );
};

const RightSection = ({
  summary,
  onFormSubmit,
}: {
  summary: string;
  onFormSubmit: FormikConfig<ConfigurationFormValues>["onSubmit"];
}) => {
  return (
    <Stack
      bg="white"
      p="1rem"
      shadow="lg"
      rounded="4px"
      width={["100%", "100%", "55%"]}
    >
      <Stack spacing="1rem">
        <HeaderContent
          heading="Configure & Generate"
          caption="Select where to generate your product updates from"
        />
        <Divider />
        <ConfigurationForm onSubmit={onFormSubmit} />
        {summary && (
          <Box>
            <Heading lineHeight="unset" fontSize="1.5rem">
              Summary
            </Heading>
            <Box p="1rem" rounded="8px" borderWidth="1px">
              {summary.split(". ").map((sentence, index) => (
                <Stack spacing="1rem" as="ul" key={index}>
                  {sentence.length > 0 && <Box as="li">{sentence}</Box>}
                </Stack>
              ))}
            </Box>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export { Header, LeftSection, RightSection };
