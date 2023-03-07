import { useRef, useEffect } from "react";

let tvScriptLoadingPromise: any;

export default function Charts(symb: any) {
  const onLoadScriptRef: any = useRef();

  // @ts-expect-error
  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (
        document.getElementById("basic-area-chart-demo") &&
        "TradingView" in window
      ) {
        new (window.TradingView as any).widget({
          container_id: "basic-area-chart-demo",
          "autosize": true,
          "symbol": symb.symb !== undefined ? symb.symb : "VANTAGE:BTCETH",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "show_popup_button": true,
          "popup_width": "1600",
          "popup_height": "800",
        });
      }
    }
  }, [symb]);

  return (
      <div id="basic-area-chart-demo" style={{height: "100%", width: "100%"}} />
  );
}