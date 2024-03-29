import { LinearIcon } from "@/components/icons";
import { Box, Button, Container, Heading, Stack } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
// import { FaGithub } from "react-icons/fa";
import { SiClickup } from "react-icons/si";

const LoginPage = () => {
  return (
    <Box h="100vh" bg="gray.800" py={{ base: "12", md: "24" }}>
      <Container
        maxW="md"
        bg="white"
        py={{ base: "0", sm: "8" }}
        px={{ base: "4", sm: "10" }}
        boxShadow={{ base: "none", sm: "xl" }}
        borderRadius={{ base: "none", sm: "xl" }}
      >
        <Stack spacing="8">
          <Stack spacing="6" align="center">
            <Heading size={{ base: "xs", md: "sm" }}>
              Log into AnnounceFlow
            </Heading>
          </Stack>
          <Stack spacing="4">
            <Button
              variant="secondary"
              onClick={() =>
                signIn("clickup", {
                  callbackUrl: `${process.env.NEXT_PUBLIC_URL}dashboard/clickup`,
                })
              }
              transition="background-image ease-in 0.2s"
              leftIcon={<SiClickup color="inherit" />}
              _hover={{
                color: "white",
                borderColor: "unset",
                bgImage:
                  "linear-gradient(to right, rgb(125, 67, 252), rgb(138, 50, 249), rgb(178, 48, 231), #cb35cf, rgb(223, 74, 172), rgb(240, 121, 88))",
              }}
            >
              Continue with Clickup
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                signIn("linear", {
                  callbackUrl: `${process.env.NEXT_PUBLIC_URL}dashboard/linear`,
                })
              }
              transition="background-color border-color ease-in 0.2s"
              leftIcon={<LinearIcon color="inherit" />}
              _hover={{
                color: "white",
                bgColor: "linear",
                borderColor: "linear",
              }}
            >
              Continue with Linear
            </Button>
            {/* <Button
              variant="secondary"
              leftIcon={<FaGithub />}
              onClick={() =>
                signIn("github", {
                  callbackUrl: `${process.env.NEXT_PUBLIC_URL}dashboard`,
                })
              }
            >
              Continue with Github
            </Button> */}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default LoginPage;
