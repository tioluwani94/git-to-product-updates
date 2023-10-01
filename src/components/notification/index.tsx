import {
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";

type NotificationType = {
  color?: string;
  icon?: ReactNode;
};

type NotificationStatus = "success" | "error" | "info";

interface Props {
  title?: string;
  message: string;
  onClose?(): void;
  status?: "success" | "error" | "info";
}

export const Notification: React.FC<Props> = (props) => {
  const { title, message, onClose, status = "success" } = props;

  const { color, icon } = notificationTypeOptions[status ?? "success"];

  const headerRegister: { [key in NotificationStatus]: string } = {
    success: "Success",
    error: "Error",
    info: "Info",
  };

  return (
    <Box
      as="section"
      pt={{ base: "4", md: "8" }}
      px={{ base: "4", md: "8" }}
      pb={{ base: "12", md: "24" }}
    >
      <Flex direction="row-reverse">
        <Box
          bg="white"
          boxShadow="md"
          borderRadius="lg"
          position="relative"
          width={{ base: "full", sm: "md" }}
        >
          <Stack direction="row" p="4" spacing="3">
            <Stack spacing="2.5">
              <Stack spacing="1">
                <HStack>
                  <Icon boxSize="1rem" color={color}>
                    {icon}
                  </Icon>
                  <Text textStyle="sm" fontWeight="medium">
                    {title ?? headerRegister[status]}
                  </Text>
                </HStack>
                <Text textStyle="sm" color="fg.muted">
                  {message}
                </Text>
              </Stack>
            </Stack>
            <CloseButton
              size="sm"
              top="8px"
              right="8px"
              onClick={onClose}
              position="absolute"
              transform="translateY(-6px)"
            />
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};

const notificationTypeOptions = {
  error: {
    color: "#DA1414",
    icon: (
      <>
        <path
          opacity="0.35"
          d="M21.734 18.025L13.718 4.14C13.364 3.526 12.708 3.148 12 3.148C11.292 3.148 10.636 3.526 10.282 4.14L2.26599 18.025C1.91199 18.639 1.91199 19.394 2.26599 20.009C2.61999 20.622 3.27499 21 3.98399 21H20.017C20.725 21 21.381 20.622 21.735 20.008C22.089 19.394 22.089 18.639 21.734 18.025Z"
          fill="currentColor"
        />
        <path
          d="M13.1788 17.746C13.1788 18.099 12.9738 19 11.9938 19C11.0138 19 10.8208 18.098 10.8208 17.746C10.8208 17.401 11.0388 16.477 11.9938 16.477C12.9488 16.477 13.1788 17.401 13.1788 17.746ZM10.9188 13.919V9.568C10.9188 8.971 11.4028 8.487 11.9998 8.487C12.5968 8.487 13.0808 8.971 13.0808 9.568V13.92C13.0808 14.516 12.5968 15 11.9998 15C11.4028 15 10.9188 14.516 10.9188 13.919Z"
          fill="currentColor"
        />
      </>
    ),
  },
  success: {
    color: "#6155EB",
    icon: (
      <>
        <path
          opacity="0.35"
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          fill="currentColor"
        />
        <path
          d="M10.9998 16C10.7438 16 10.4878 15.902 10.2928 15.707L7.29276 12.707C6.90176 12.316 6.90176 11.684 7.29276 11.293C7.68376 10.902 8.31576 10.902 8.70676 11.293L10.9998 13.586L15.2928 9.293C15.6838 8.902 16.3158 8.902 16.7068 9.293C17.0978 9.684 17.0978 10.316 16.7068 10.707L11.7068 15.707C11.5118 15.902 11.2558 16 10.9998 16Z"
          fill="currentColor"
        />
      </>
    ),
  },
  info: {
    color: "#6155EB",
    icon: (
      <>
        <path
          d="M9 20C9 21.657 10.343 23 12 23C13.657 23 15 21.657 15 20H9Z"
          fill="currentColor"
        />
        <path
          opacity="0.35"
          d="M19 10.667V9.29401C19 5.46101 16.047 2.11901 12.215 2.00401C8.251 1.88401 5 5.06201 5 9.00001V10.667C5 12.182 4.509 13.655 3.6 14.867L2.45 16.4C2.158 16.789 2 17.263 2 17.75C2 18.993 3.007 20 4.25 20H19.75C20.993 20 22 18.993 22 17.75C22 17.263 21.842 16.789 21.55 16.4L20.4 14.867C19.491 13.655 19 12.181 19 10.667Z"
          fill="currentColor"
        />
        <path
          d="M22 9.99999C21.448 9.99999 21 9.55299 21 8.99999C21 7.75599 20.746 6.54499 20.246 5.39999C20.024 4.89399 20.255 4.30399 20.761 4.08399C21.267 3.86099 21.857 4.09299 22.078 4.59999C22.69 5.99699 23 7.47799 23 8.99999C23 9.55299 22.552 9.99999 22 9.99999Z"
          fill="currentColor"
        />
        <path
          d="M2 10C1.448 10 1 9.553 1 9C1 7.478 1.31 5.99699 1.922 4.6C2.143 4.093 2.733 3.862 3.239 4.084C3.745 4.305 3.976 4.895 3.754 5.4C3.254 6.545 3 7.756 3 9C3 9.553 2.552 10 2 10Z"
          fill="currentColor"
        />
      </>
    ),
  },
} as { [key in NotificationStatus]: NotificationType };
