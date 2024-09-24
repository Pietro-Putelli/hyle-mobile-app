#!/bin/bash

# Prompt the user for the folder name
read -p "Enter the name of the folder: " folder_name

# Create the folder inside src/components
mkdir -p src/components/"$folder_name"

# Create the necessary files inside the folder
touch src/components/"$folder_name"/index.tsx
touch src/components/"$folder_name"/styles.ts
touch src/components/"$folder_name"/types.ts

echo "import React from 'react';
import styles from './styles';

const $folder_name = () => {
  return <></>;
};

export default $folder_name;" > src/components/"$folder_name"/index.tsx;

echo "import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({});

export default styles;" > src/components/"$folder_name"/styles.ts;

echo "Folder '$folder_name' created with index.tsx, styles.ts, and types.ts files."
