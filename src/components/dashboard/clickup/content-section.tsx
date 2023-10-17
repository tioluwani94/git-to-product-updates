import { CollapseIcon } from "@/components/icons";
import {
  Box,
  Container,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  Stack,
  Switch,
  Text,
  Tooltip,
  VStack,
  useClipboard,
} from "@chakra-ui/react";
import { Editor } from "novel";
import React, { useState } from "react";
import { FiCheckCircle, FiCopy } from "react-icons/fi";
import ReactMarkdown from "react-markdown";

export const ContentSection: React.FC<{
  content: string;
  onToggleConfigPanel(): void;
  onChangeContent(content: string): void;
}> = (props) => {
  const { content, onChangeContent, onToggleConfigPanel } = props;

  const { onCopy, hasCopied } = useClipboard(content);

  const [isEditing, setIsEditing] = useState(false);

  return (
    <Container h="100%">
      <Stack
        h="100%"
        spacing="6"
        sx={{
          ".ProseMirror": {
            padding: "0!important",
          },
        }}
      >
        {content ? (
          <Stack bg="white" spacing="6" rounded="md" position="relative">
            <Flex alignItems="center" justifyContent="space-between">
              <Heading size="xs">Generated content</Heading>
              <Stack direction="row">
                <Tooltip
                  aria-label={hasCopied ? "Copied content" : "Copy content"}
                  label={hasCopied ? "Copied content" : "Copy content"}
                >
                  <IconButton
                    isRound
                    size="xs"
                    onClick={onCopy}
                    variant="outline"
                    aria-label="Copy content"
                    icon={hasCopied ? <FiCheckCircle /> : <FiCopy />}
                  />
                </Tooltip>
                <Tooltip
                  label="Toggle config panel"
                  aria-label="Toggle config panel"
                >
                  <IconButton
                    isRound
                    size="xs"
                    variant="outline"
                    icon={<CollapseIcon />}
                    onClick={onToggleConfigPanel}
                    aria-label="Toggle config panel"
                  />
                </Tooltip>
                <Tooltip
                  shouldWrapChildren
                  aria-label="Toggle edit mode"
                  label={`Edit mode: ${isEditing ? "on" : "off"}`}
                >
                  <Switch
                    size="sm"
                    isChecked={isEditing}
                    onChange={(e) => setIsEditing(e.target.checked)}
                  />
                </Tooltip>
              </Stack>
            </Flex>
            {isEditing ? (
              <Editor
                defaultValue={content}
                disableLocalStorage={true}
                onUpdate={(editor) => {
                  onChangeContent(editor?.storage.markdown.getMarkdown());
                }}
                className="relative min-h-[500px] py-0 w-full max-w-screen-lg bg-white"
              />
            ) : (
              <ReactMarkdown
                components={{
                  a: (props) => (
                    <Link
                      color="#3525e6"
                      target="_blank"
                      href={props.href}
                      rel="noopener noreferrer"
                      style={{
                        ...props.style,
                        color: "#3525e6",
                        fontWeight: 400,
                        wordBreak: "break-word",
                        textDecorationLine: "underline",
                      }}
                    >
                      {props.children}
                    </Link>
                  ),
                  p: ({ children, ...rest }) => (
                    <Text wordBreak="break-word" color="gray.900">
                      {children}
                    </Text>
                  ),
                  h2: (props) => (
                    <Heading lineHeight="unset" fontSize="lg" {...props} />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            )}
          </Stack>
        ) : (
          <VStack h="100%" justifyContent="center">
            <VStack borderWidth="1px" rounded="50%" boxSize={8}>
              <Icon viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </Icon>
            </VStack>
            <Heading textAlign="center" size="xs">
              Content Panel
            </Heading>
            <Text textAlign="center" color="gray.500" fontSize="sm">
              AI generate content will be displayed here once configuration is
              done!
            </Text>
          </VStack>
        )}
      </Stack>
    </Container>
  );
};
