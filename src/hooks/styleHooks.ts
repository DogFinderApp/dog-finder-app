import { SxProps, Theme, useTheme } from "@mui/material";
import { useMemo } from "react";

/**
 * A style generator function is a function that receives our Theme (Read theme),
 * and (optionally) any props (just like any functional component)
 * and generates an Emotion object that maps between names (keys) and CSS props
 *
 * =============================================================================
 *
 * an Emotion style object example:
 * {
 *      root: { width: 100%, height: 100% },
 *      header: { position: top },
 *      button: { color: blue }
 * }
 */
export type StyleGenerator<TStyleKey, TProps> = (
  theme: Theme,
  props: TProps,
) => Record<keyof TStyleKey, SxProps<Theme>>;

/**
 * A style hook for generating a Emotion object within the current
 * react component. use this method for creating instant CSS style objects that
 * can be used by your react components and elements.
 * Optional: The hook can receive custom props, just like functional components.
 *
 * =============================================================================
 *
 * A usage example (without props):
 * const componentStyle = useStyleHook((theme) => {
 *      root: { width: 100%, height: 100% },
 *      header: { position: top },
 *      button: { color: blue }
 * });
 *
 * A usage example (with props):
 * const propsForHook = { isMouseHover: true };
 * const componentStyle = useStyleHook((theme, props) => {
 *      root: props.isMouseHover
 *          ? { backgroundColor: 'blue' }
 *          : { backgroundColor: 'grey' },
 *      header: { position: top },
 *      button: { color: 'blue' }
 * }, propsForHook);
 *
 * return <div sx={componentStyle.root}> ... </div>
 */
export function useStyleHook<TStyleKey, TProps = Record<never, never>>(
  styleGenerator: StyleGenerator<TStyleKey, TProps>,
  props: TProps = {} as TProps,
) {
  const theme = useTheme();

  const renderedStyle = useMemo(() => {
    return styleGenerator(theme, props);
  }, [props, styleGenerator, theme]);

  return renderedStyle;
}

/**
 * Builds A new style hook that could be used within your components for generating
 * Emotion style objects. Optional: the style hook can recieve custom props
 * (just like functional components in react)
 *
 * =============================================================================
 *
 * A usage example (without props):
 *
 * const useComponentStyle = createStyleHook((theme) => {
 *      root: { width: 100%, height: 100% },
 *      header: { position: top },
 *      button: { color: blue }
 * });
 *
 * const componentStyle = useComponentStyle();
 * return <div sx={componentStyle.root}> ... </div>
 *
 * A usage example (with props):
 * const useComponentStyle = createStyleHook((theme, props: { isMouseHover: boolean }) => {
 *      return {
 *          root: props.isMouseHover ? { backgroundColor: 'blue' } : { backgroundColor: 'grey' },
 *          header: { position: top },
 *          button: { color: blue }
 *      };
 * });
 *
 * const propsForStyle = { isHover: false };
 * const componentStyle = useComponentStyle(propsForStyle);
 * return <div sx={componentStyle.root}> ... </div>
 */
export function createStyleHook<TStyleKey>(
  styleGenerator: StyleGenerator<TStyleKey, undefined>,
): () => Record<keyof TStyleKey, SxProps<Theme>>;

export function createStyleHook<TStyleKey, TProps>(
  styleGenerator: StyleGenerator<TStyleKey, TProps>,
): (props: TProps) => Record<keyof TStyleKey, SxProps<Theme>>;

export function createStyleHook<TStyleKey, TProps = Record<never, never>>(
  styleGenerator: StyleGenerator<TStyleKey, TProps>,
) {
  return (props: TProps = {} as TProps) => {
    return useStyleHook(styleGenerator, props);
  };
}
