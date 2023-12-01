import DatePicker from "@/components/date-picker";
import {
  RadioButton,
  RadioButtonGroup,
} from "@/components/layout/radio-button-group";
import {
  RadioCard,
  RadioCardGroup,
} from "@/components/layout/radio-card-group";
import { usePage } from "@/hooks/page";
import { TONES, WRITING_LENGTH, contentTypeRegister } from "@/utils/data";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from "@choc-ui/chakra-autocomplete";
import React from "react";

export const ContentGenerationConfigForm: React.FC<{
  statusOptions: { label: string; value: string; color?: string }[];
}> = ({ statusOptions }) => {
  const {
    tone,
    statuses,
    start_date,
    content_type,
    writing_length,
    product_description,
    productDescriptionInputRef,
    setTone,
    setStatuses,
    setStartDate,
    setContentType,
    setWritingLength,
    setProductDescription,
  } = usePage();

  return (
    <>
      <FormControl>
        <FormLabel>Give a short description about your product</FormLabel>
        <Input
          size="sm"
          type="text"
          value={product_description}
          ref={productDescriptionInputRef}
          onChange={(e) => setProductDescription(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel color="gray.600">
          What type of content do you want to create?
        </FormLabel>
        <RadioCardGroup
          w="100%"
          name="type"
          value={content_type}
          onChange={(v) => setContentType(v)}
          direction={{ base: "column", md: "row" }}
        >
          {Object.keys(contentTypeRegister).map((k) => (
            <RadioCard
              key={k}
              value={k}
              containerProps={{
                width: { base: "100%", md: "50%" },
              }}
            >
              <Text fontSize="sm" fontWeight="medium">
                {contentTypeRegister[k]}
              </Text>
            </RadioCard>
          ))}
        </RadioCardGroup>
      </FormControl>
      <FormControl>
        <FormLabel color="gray.600">
          What status do you use to represent done tasks?
        </FormLabel>
        <AutoComplete
          multiple
          openOnFocus
          closeOnSelect
          value={statuses}
          restoreOnBlurIfEmpty={false}
          onChange={(vals) => setStatuses(vals)}
        >
          <AutoCompleteInput
            size="sm"
            rounded="sm"
            variant="filled"
            borderColor="gray.200"
            placeholder="Select status"
            sx={{
              ".chakra-input__group": {
                w: "auto",
              },
              ".chakra-wrap__list": {
                alignItems: "center",
              },
            }}
          >
            {({ tags }) =>
              tags.map((tag, tid) => (
                <AutoCompleteTag
                  key={tid}
                  label={tag.label}
                  alignItems="center"
                  onRemove={tag.onRemove}
                />
              ))
            }
          </AutoCompleteInput>
          <AutoCompleteList py="2">
            {statusOptions?.map((s, id) => (
              <AutoCompleteItem
                bg="fg.muted"
                align="center"
                value={s.value}
                key={`option-${id}`}
                textTransform="capitalize"
              >
                <Box rounded="full" boxSize="2" bg={s.color} />
                <Text ml="4">{s.label}</Text>
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
        <FormHelperText fontSize="xs">
          Most teams use Closed, Completed or Deployed
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Select tasks completed starting from this date</FormLabel>
        <DatePicker
          value={start_date}
          inputProps={{ size: "sm" }}
          disabled={{ after: new Date() }}
          onChange={(value: any) => setStartDate(value)}
        />
        <FormHelperText fontSize="xs">
          Use this option if your team has a done status setup
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel color="gray.600">Tone</FormLabel>
        <RadioButtonGroup size="sm" value={tone} onChange={(v) => setTone(v)}>
          {TONES.map((t) => (
            <RadioButton value={t.value} key={t.value}>
              {t.label}
            </RadioButton>
          ))}
        </RadioButtonGroup>
      </FormControl>
      {content_type === "features" && (
        <FormControl>
          <FormLabel color="gray.600">Writing length</FormLabel>

          <RadioButtonGroup
            size="sm"
            value={writing_length}
            onChange={(v) => setWritingLength(v)}
          >
            {WRITING_LENGTH.map((t) => (
              <RadioButton value={t.value} key={t.value}>
                {t.label}
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </FormControl>
      )}
    </>
  );
};
