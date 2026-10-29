import type { StyleProp, TextStyle } from 'react-native';

import { ThemedText, type ThemedTextProps } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type RichTextProps = {
  text: string;
  type?: ThemedTextProps['type'];
  themeColor?: ThemedTextProps['themeColor'];
  style?: StyleProp<TextStyle>;
  highlightColor?: string;
};

/** "**vurgulu**" işaretli metni, vurgulu kısımları kalın ve renkli göstererek çizer. */
export function RichText({ text, type = 'default', themeColor, style, highlightColor }: RichTextProps) {
  const colors = useTheme();
  const parts = text.split(/\*\*(.+?)\*\*/g);

  return (
    <ThemedText type={type} themeColor={themeColor} style={style}>
      {parts.map((part, index) =>
        // split ile yakalanan gruplar tek indekslerde yer alır.
        index % 2 === 1 ? (
          <ThemedText key={index} type={type} style={{ color: highlightColor ?? colors.cyan, fontFamily: Fonts.bold }}>
            {part}
          </ThemedText>
        ) : (
          part
        ),
      )}
    </ThemedText>
  );
}
