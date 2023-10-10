import { CollapseIcon } from "@/components/icons";
import {
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Switch,
  Text,
  Tooltip,
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
    <Stack
      spacing="6"
      sx={{
        ".ProseMirror": {
          padding: "0!important",
        },
      }}
    >
      {content && (
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
      )}
    </Stack>
  );
};
