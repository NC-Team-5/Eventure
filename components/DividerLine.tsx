import React from 'react';
import { View, StyleSheet } from 'react-native';

const HorizontalLine = () => {
    return <View style={styles.line} />;
};

const styles = StyleSheet.create({
    line: {
        height: 1,
        backgroundColor: "#b2a591",
        marginVertical: 30,
        marginHorizontal: 50
    },
});

export default HorizontalLine;
