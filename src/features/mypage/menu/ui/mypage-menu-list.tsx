import { MenuList, type MenuListItem } from "@/shared/ui";

type MypageMenuListProps = {
  items: MenuListItem[];
  onItemSelect?: (item: MenuListItem) => void;
};

export function MypageMenuList({ items, onItemSelect }: MypageMenuListProps) {
  return <MenuList items={items} ariaLabel="마이페이지 메뉴" onItemSelect={onItemSelect} />;
}
