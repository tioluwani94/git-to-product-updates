import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";

export const PageContainer = styled(Box)`
  .PanelGroup {
    padding: 16px;
  }
  .Panel {
    background: white;
    border-radius: 6px;
    padding: 2rem 1rem;
    border: 1px solid #edf2f7;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  .ResizeHandleOuter {
    outline: none;
    display: flex;
    padding: 0.5rem;
    flex: 0 0 1.75rem;
    align-items: stretch;
    justify-content: stretch;
    background-color: transparent;
  }
  .ResizeHandleOuter[data-resize-handle-active] {
    background-color: #f7fafc;

    .ResizeHandleInner {
      background-color: white;

      .Icon {
        display: none;
      }
    }
  }
  .ResizeHandleInner {
    flex: 1;
    position: relative;
    border-radius: 0.75rem;
    background-color: transparent;
    transition: background-color 0.2s linear;
  }
  .Icon {
    width: 1em;
    height: 1em;
    color: #394452;
    position: absolute;
    left: calc(50% - 0.5rem);
    top: calc(50% - 0.5rem);
  }
`;
