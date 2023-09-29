import { Box, Button, Heading, LightMode, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import ReactCompareImage from "react-compare-image";

export const Hero = () => {
  const { push } = useRouter();
  return (
    <Box as="section" bg="gray.800" color="white" py="4rem">
      <Box
        mx="auto"
        px={{ base: "6", md: "8" }}
        maxW={{ base: "xl", md: "5xl" }}
      >
        <Box textAlign="center">
          <Heading
            as="h1"
            mx="auto"
            size="xl"
            maxW="54rem"
            lineHeight="1.2"
            letterSpacing="tight"
            fontWeight="bold"
          >
            AI-generated product announcements from your Clickup tasks
          </Heading>
          <Text fontSize="xl" mt="4" maxW="xl" mx="auto">
            Simplify your release process and generate polished and detailed
            product announcements with the help of AI.
          </Text>
        </Box>

        <Stack
          my="8"
          spacing="4"
          justify="center"
          direction={{ base: "column", md: "row" }}
        >
          <LightMode>
            <Button
              px="8"
              size="lg"
              fontSize="md"
              fontWeight="bold"
              colorScheme="blue"
              onClick={() => push("/login")}
            >
              Get started
            </Button>
          </LightMode>
        </Stack>

        <Box
          h="500px"
          rounded="lg"
          cursor="pointer"
          overflow="hidden"
          className="group"
          position="relative"
        >
          <ReactCompareImage
            leftImage="/images/clickup-board.png"
            rightImage="/images/announcement.png"
          />
        </Box>
      </Box>
    </Box>
  );
};
