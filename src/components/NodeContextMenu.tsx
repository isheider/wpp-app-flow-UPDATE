import React from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import {
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";

export default function () {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState("pedro");

  return (
    <ContextMenu.Portal>
      <ContextMenu.Content
        className="ContextMenuContent"
        //   alignOffset={5}
        //   align="end"
      >
        <ContextMenu.Item className="ContextMenuItem">
          Back <div className="RightSlot">⌘+[</div>
        </ContextMenu.Item>
        <ContextMenu.Item className="ContextMenuItem" disabled>
          Foward <div className="RightSlot">⌘+]</div>
        </ContextMenu.Item>
        <ContextMenu.Item className="ContextMenuItem">
          Reload <div className="RightSlot">⌘+R</div>
        </ContextMenu.Item>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger className="ContextMenuSubTrigger">
            More Tools
            <div className="RightSlot">
              <ChevronRightIcon />
            </div>
          </ContextMenu.SubTrigger>
          <ContextMenu.Portal>
            <ContextMenu.SubContent
              className="ContextMenuSubContent"
              sideOffset={2}
              alignOffset={-5}
            >
              <ContextMenu.Item className="ContextMenuItem">
                Save Page As… <div className="RightSlot">⌘+S</div>
              </ContextMenu.Item>
              <ContextMenu.Item className="ContextMenuItem">
                Create Shortcut…
              </ContextMenu.Item>
              <ContextMenu.Item className="ContextMenuItem">
                Name Window…
              </ContextMenu.Item>
              <ContextMenu.Separator className="ContextMenuSeparator" />
              <ContextMenu.Item className="ContextMenuItem">
                Developer Tools
              </ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Portal>
        </ContextMenu.Sub>

        <ContextMenu.Separator className="ContextMenuSeparator" />

        <ContextMenu.Separator className="ContextMenuSeparator" />

        <ContextMenu.Label className="ContextMenuLabel">
          People
        </ContextMenu.Label>
        <ContextMenu.RadioGroup value={person} onValueChange={setPerson}>
          <ContextMenu.RadioItem className="ContextMenuRadioItem" value="pedro">
            <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
              <DotFilledIcon />
            </ContextMenu.ItemIndicator>
            Pedro Duarte
          </ContextMenu.RadioItem>
          <ContextMenu.RadioItem className="ContextMenuRadioItem" value="colm">
            <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
              <DotFilledIcon />
            </ContextMenu.ItemIndicator>
            Colm Tuite
          </ContextMenu.RadioItem>
        </ContextMenu.RadioGroup>
      </ContextMenu.Content>
    </ContextMenu.Portal>
  );
}
