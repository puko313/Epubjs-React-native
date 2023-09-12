import * as React from 'react';
import DocumentPicker from 'react-native-document-picker';
import {
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Reader, ReaderProvider } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import base64 from './base64';
import { styles } from './styles';

const epub =
  'https://epubjs-react-native.s3.amazonaws.com/failing-forward.epub';
const opf = 'https://s3.amazonaws.com/moby-dick/OPS/package.opf';

export function Formats() {
  const { width, height } = useWindowDimensions();
  const [src, setSrc] = React.useState(opf);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.options}>
        <TouchableOpacity onPress={() => setSrc(opf)}>
          <Text>Book (.opf)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSrc(epub)}>
          <Text>Book (.epub)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSrc(base64)}>
          <Text>Book (base64)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Instructions',
              'To make this work copy the books (.epub) located on your computer and paste in the emulator',
              [
                {
                  text: 'Ok',
                  onPress: async () => {
                    const [{ fileCopyUri }] = await DocumentPicker.pick({
                      type: [DocumentPicker.types.allFiles],
                      allowMultiSelection: false,
                      copyTo: 'cachesDirectory',
                    });

                    if (fileCopyUri) setSrc(fileCopyUri);
                  },
                },
              ]
            );
          }}
        >
          <Text>Book (local)</Text>
        </TouchableOpacity>
      </View>

      <ReaderProvider>
        <Reader
          src={src}
          width={width}
          height={height * 0.7}
          fileSystem={useFileSystem}
        />
      </ReaderProvider>

      {src === opf && (
        <Text style={styles.currentFormat}>Current format: .opf</Text>
      )}

      {src === epub && (
        <Text style={styles.currentFormat}>Current format: .epub</Text>
      )}

      {src === base64 && (
        <Text style={styles.currentFormat}>Current format: base64</Text>
      )}

      {src !== opf && src !== epub && src !== base64 && (
        <Text style={styles.currentFormat}>Current format: local</Text>
      )}
    </SafeAreaView>
  );
}
