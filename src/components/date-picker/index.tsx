import {
  Box,
  InputProps,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { format, isValid, parse } from "date-fns";
import { ChangeEventHandler, useEffect, useState } from "react";
import { ClassNames, DayPicker, DayPickerSingleProps } from "react-day-picker";
import styles from "react-day-picker/dist/style.module.css";
import { OutsideClickHandler } from "../outside-click";
import { FiCalendar } from "react-icons/fi";
import "./date-picker.module.css";

export type DatePickerProps = Partial<DayPickerSingleProps> & {
  value: any;
  onChange(date?: any): void;
  inputProps: Partial<InputProps>;
};

export default function DatePicker({
  value,
  onChange,
  inputProps,
  ...rest
}: DatePickerProps) {
  const [selected, setSelected] = useState<Date>();
  const [inputValue, setInputValue] = useState<string>(value ?? "");

  const { isOpen, onClose, onOpen } = useDisclosure();

  const classNames: ClassNames = {
    ...styles,
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.currentTarget.value);
    const date = parse(e.currentTarget.value, "yyyy-MM-dd", new Date());
    if (isValid(date)) {
      setSelected(date);
      onChange(format(date, "yyyy-MM-dd"));
    } else {
      setSelected(undefined);
      onChange(undefined);
    }
  };

  const handleDaySelect = (date?: Date) => {
    if (date) {
      setSelected(date);
      setInputValue(format(date, "yyyy-MM-dd"));
      onChange(format(date, "yyyy-MM-dd"));
      onClose();
    } else {
      setInputValue("");
    }
  };

  useEffect(() => {
    if (value) {
      setInputValue(value);
      setSelected(new Date(value));
    }
  }, [value]);

  return (
    <Box width="100%" position="relative">
      <InputGroup size={inputProps.size}>
        <InputLeftElement>
          <FiCalendar size="0.8rem" color="gray.400" />
        </InputLeftElement>
        <Input
          onFocus={onOpen}
          value={inputValue}
          onMouseDown={onOpen}
          onChange={handleInputChange}
          placeholder={format(new Date(), "yyyy-MM-dd")}
          {...inputProps}
        />
      </InputGroup>
      {isOpen && (
        <OutsideClickHandler
          zIndex={1000000}
          position="absolute"
          onClickOutside={onClose}
        >
          <Box
            py="1rem"
            rounded="8px"
            bg="white"
            shadow="md"
            height="400px"
            width="320px"
          >
            <DayPicker
              fixedWeeks
              mode="single"
              showOutsideDays
              fromYear={2020}
              selected={selected}
              initialFocus={isOpen}
              classNames={classNames}
              defaultMonth={selected}
              captionLayout="dropdown"
              onSelect={handleDaySelect}
              toYear={new Date().getFullYear()}
              {...rest}
            />
          </Box>
        </OutsideClickHandler>
      )}
    </Box>
  );
}
