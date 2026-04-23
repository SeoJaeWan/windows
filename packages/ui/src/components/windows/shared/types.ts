/**
 * windows/shared/types
 *
 * Pure data-shape types shared by the windows family (Folder, Browser).
 * React-free — these are consumable by both packages/ui leaves and
 * downstream consumers (apps/web) without React import pollution.
 *
 * The public Folder and Browser components accept only these data shapes;
 * detail states (hover, expanded, open) are host-owned and do not appear
 * in the public contract.
 */

/** Generic dropdown row used by Browser's address dropdown. */
export type DropdownItem = {
  id: string;
  label: string;
  iconUrl?: string;
};

/** Folder's location/search dropdown row — optional `path` for location suggestions. */
export type FolderDropdownItem = DropdownItem & {
  path?: string;
};

/** Filter chip displayed under the Folder search input. */
export type SearchChip = {
  id: string;
  label: string;
  active?: boolean;
};

/** Sidebar entry in the Folder body. */
export type SidebarItem = {
  id: string;
  label: string;
  iconUrl?: string;
};

/** Grid tile in the Folder body. */
export type GridItem = {
  id: string;
  name: string;
  thumbnailUrl?: string;
  iconUrl?: string;
  meta?: string;
};
