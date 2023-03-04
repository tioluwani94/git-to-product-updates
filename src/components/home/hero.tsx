import {
  Box,
  Button,
  Circle,
  Heading,
  Img,
  LightMode,
  Stack,
  Text,
  VisuallyHidden,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { FaGithub, FaPlay } from "react-icons/fa";

export const Hero = () => {
  return (
    <Box as="section" bg="gray.800" color="white" py="7.5rem">
      <Box
        maxW={{ base: "xl", md: "5xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
      >
        <Box textAlign="center">
          <Heading
            as="h1"
            mx="auto"
            size="3xl"
            maxW="54rem"
            lineHeight="1.2"
            letterSpacing="tight"
            fontWeight="extrabold"
          >
            AI-generated product updates from Git commits, PRs and changelogs
          </Heading>
          <Text fontSize="xl" mt="4" maxW="xl" mx="auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore
          </Text>
        </Box>

        <Stack
          justify="center"
          direction={{ base: "column", md: "row" }}
          mt="10"
          mb="20"
          spacing="4"
        >
          <LightMode>
            <Button
              px="8"
              size="lg"
              fontSize="md"
              fontWeight="bold"
              colorScheme="blue"
              leftIcon={<FaGithub />}
              onClick={() => signIn()}
            >
              Get started with Github
            </Button>
          </LightMode>
        </Stack>

        <Box
          className="group"
          cursor="pointer"
          position="relative"
          rounded="lg"
          overflow="hidden"
        >
          <Img
            alt="Screenshot of Envelope App"
            src="https://res.cloudinary.com/chakra-ui-pro/image/upload/v1621085270/pro-website/app-screenshot-light_kit2sp.png"
          />
          <Circle
            size="20"
            as="button"
            bg="white"
            shadow="lg"
            color="purple.600"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate3d(-50%, -50%, 0)"
            fontSize="xl"
            transition="all 0.2s"
            _groupHover={{
              transform: "translate3d(-50%, -50%, 0) scale(1.05)",
            }}
          >
            <VisuallyHidden>Play demo video</VisuallyHidden>
            <FaPlay />
          </Circle>
        </Box>
      </Box>
    </Box>
  );
};
