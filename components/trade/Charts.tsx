import {Flex, Text} from '@chakra-ui/react';
import TradingView from 'react-tradingview-widgets';

export default function Charts() {

    return (
        <Flex direction="column">
            <Text>Charts</Text>
            <TradingView
                symbol="BITSTAMP:ETHUSD"
                autosize
                theme="light"
                style={{width: "100%", height: "100%"}}
                />
        </Flex>
    );
}
