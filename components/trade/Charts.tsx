import {Flex, Text} from '@chakra-ui/react';

import { useRef, useEffect } from 'react';

let tvScriptLoadingPromise: any;

export default function Charts() {

    const onLoadScriptRef: any = useRef();

    // @ts-expect-error
    useEffect(() => {
        onLoadScriptRef.current = createWidget;
  
        if (!tvScriptLoadingPromise) {
          tvScriptLoadingPromise = new Promise((resolve) => {
            const script = document.createElement('script');
            script.id = 'tradingview-widget-loading-script';
            script.src = 'https://s3.tradingview.com/tv.js';
            script.type = 'text/javascript';
            script.onload = resolve;
  
            document.head.appendChild(script);
          });
        }
  
        tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());
  
        return () => onLoadScriptRef.current = null;
  
        function createWidget() {
          if (document.getElementById('basic-area-chart-demo') && 'TradingView' in window) {
            new (window.TradingView as any).widget({
              container_id: "basic-area-chart-demo",
              width: "100%",
              height: "100%",
              autosize: true,
              symbol: "ETHUSD",
              interval: "D",
              timezone: "exchange",
              theme: "dark",
              style: "1",
              toolbar_bg: "#f1f3f6",
              hide_top_toolbar: true,
              save_image: false,
              locale: "en"
            });
          }
        }
      },
      []
    );

    return (
        <div className='tradingview-widget-container'>
          <div id='basic-area-chart-demo' />
          <div className="tradingview-widget-copyright">
          </div>
        </div>  
      );
    }

//     return (
//         <Flex direction="column">
//             <Text>Charts</Text>   
//         </Flex>
//     );
// }
