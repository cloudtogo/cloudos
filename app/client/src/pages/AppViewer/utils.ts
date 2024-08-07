import type { NavigationSetting } from "constants/AppConstants";
import { NAVIGATION_SETTINGS } from "constants/AppConstants";
import { Colors } from "constants/Colors";
import tinycolor from "tinycolor2";
import {
  calculateHoverColor,
  getComplementaryGrayscaleColor,
  isLightColor,
} from "widgets/WidgetUtils";
import { viewerURL } from "@appsmith/RouteBuilder";

// Menu Item Background Color - Active
export const getMenuItemBackgroundColorWhenActive = (
  color: string,
  navColorStyle: NavigationSetting["colorStyle"] = NAVIGATION_SETTINGS
    .COLOR_STYLE.LIGHT,
) => {
  const colorHsl = tinycolor(color).toHsl();

  switch (navColorStyle) {
    case NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT: {
      if (isLightColor(color)) {
        colorHsl.l -= 0.1;

        return tinycolor(colorHsl).toHexString();
      } else {
        colorHsl.l += 0.35;
        colorHsl.a = 0.3;

        return tinycolor(colorHsl).toHex8String();
      }
    }
    case NAVIGATION_SETTINGS.COLOR_STYLE.THEME: {
      return calculateHoverColor(color);
    }
  }
};

// Menu Item Background Color - Hover
export const getMenuItemBackgroundColorOnHover = (
  color: string,
  navColorStyle: NavigationSetting["colorStyle"] = NAVIGATION_SETTINGS
    .COLOR_STYLE.LIGHT,
) => {
  if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT) {
    return "var(--ads-v2-color-bg-subtle)";
  } else if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.THEME) {
    return tinycolor(calculateHoverColor(color)).toHexString();
  }
};

// Menu Item Text Color - Default, Hover, Active
export const getMenuItemTextColor = (
  color: string,
  navColorStyle: NavigationSetting["colorStyle"] = NAVIGATION_SETTINGS
    .COLOR_STYLE.LIGHT,
  isDefaultState = false,
) => {
  switch (navColorStyle) {
    case NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT: {
      const resultantColor: tinycolor.ColorFormats.HSLA | string =
        tinycolor(color).toHsl();

      if (isDefaultState) {
        return Colors.GREY_9;
      }

      if (isLightColor(color)) {
        resultantColor.l += 0.35;

        return tinycolor(resultantColor).toHexString();
      } else {
        if (resultantColor.l <= 0.05) {
          /**
           * if the color is close to black, it will have a near transparent background
           * due to the getMenuItemBackgroundColorWhenActive function.
           * Therefore, only black text will be accessible and suitable in this case.
           */
          return Colors.BLACK;
        } else if (resultantColor.l > 0.05 && resultantColor.l <= 0.15) {
          // if the color is extremely dark
          return getComplementaryGrayscaleColor(color);
        } else {
          resultantColor.l -= 0.1;

          return tinycolor(resultantColor).toHexString();
        }
      }
    }
    case NAVIGATION_SETTINGS.COLOR_STYLE.THEME: {
      return getComplementaryGrayscaleColor(color);
    }
  }
};

// Menu Container Background Color
export const getMenuContainerBackgroundColor = (
  color: string,
  navColorStyle: NavigationSetting["colorStyle"] = NAVIGATION_SETTINGS
    .COLOR_STYLE.LIGHT,
) => {
  if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT) {
    return Colors.WHITE;
  } else if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.THEME) {
    return color;
  }
};

export const getApplicationNameTextColor = (
  color: string,
  navColorStyle: NavigationSetting["colorStyle"] = NAVIGATION_SETTINGS
    .COLOR_STYLE.LIGHT,
) => {
  if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT) {
    return Colors.GREY_9;
  } else if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.THEME) {
    return getComplementaryGrayscaleColor(color);
  }
};

export const getSignInButtonStyles = (
  color: string,
  navColorStyle: NavigationSetting["colorStyle"] = NAVIGATION_SETTINGS
    .COLOR_STYLE.LIGHT,
) => {
  const styles = {
    background: Colors.WHITE,
    backgroundOnHover: Colors.GRAY_100,
    color: Colors.BLACK,
  };

  if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.LIGHT) {
    styles.background = color;
    styles.color = getComplementaryGrayscaleColor(color);
  } else if (navColorStyle === NAVIGATION_SETTINGS.COLOR_STYLE.THEME) {
    styles.background = getComplementaryGrayscaleColor(color);
    styles.color = isLightColor(color) ? Colors.WHITE : color;
  }

  styles.backgroundOnHover = calculateHoverColor(styles.background, false);

  return styles;
};

const getIconType = (icon: any) => (icon ? `icon-${icon}` : undefined);

export const makeRouteNode =
  (pagesMap: any, newTree: any[], hideRow: any[]) => (node: any) => {
    let item: any;
    const icon = getIconType(node.icon);
    if (node.isPage) {
      if (pagesMap[node.title]) {
        item = {
          name: node.title,
          icon,
          path: viewerURL({
            pageId: pagesMap[node.title].pageId,
          }),
        };
        pagesMap[node.title].visited = true;
      }
    } else if (node.children) {
      const routes: any = [];
      node.children.forEach(makeRouteNode(pagesMap, routes, hideRow));
      item = {
        name: node.title,
        icon,
        path: "/",
        routes,
      };
    } else {
      item = {
        name: node.title,
        icon,
        path: "/",
      };
    }
    if (item) {
      if (!hideRow.find((hn) => hn.pageId === node.pageId)) {
        newTree.push(item);
      }
    }
  };

export const findParentPaths = (
  data: any[],
  target: string,
  currentPath = [],
) => {
  // 遍历树形数组数据
  for (const node of data) {
    const nodeName = node.title;

    if (nodeName === target) {
      // 找到目标 Name，返回当前路径
      return [currentPath.concat(node)];
    }

    if (node.children) {
      // 递归查找子节点
      const childPath = currentPath.concat(node);
      const found: any = findParentPaths(node.children, target, childPath);
      if (found.length > 0) {
        // 找到目标 ID，将当前节点 ID 添加到路径中并返回
        return [currentPath.concat(node)].concat(found);
      }
    }
  }

  // 没有找到目标 ID，返回空数组
  return [];
};
