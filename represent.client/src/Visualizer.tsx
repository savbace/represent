import { useEffect, useRef } from "react";
import { demoDraw } from "./RouteDrawing";
import ActivityInfo from "./engine/ActivityInfo";

const activity: ActivityInfo = {
  name: "Morning Run",
  distance: 6016.8,
  movingTime: 1878,
  startDate: "2024-06-24T04:40:12Z",
  elevationGain: 31,
  polylineMap:
    "y{_oHyqvqCKP[r@ENWj@Kh@IJi@rDk@nCSb@a@|AUrAg@vACTMTc@pAO\\g@vBUbAIv@]bBQtAKZ}@hEAXq@bDIl@[~A?Ha@xAe@`CUx@a@`AWhAeAtFI^MXOx@Mb@_@vBM~@KFEJKZEb@IT}@p@GH?DH^ANEJk@p@On@Yr@MfAY|@?PBZAFCFE?u@?o@Eo@Gq@QwAIwAUSKS[IKm@SOK}B{DUe@g@w@_@u@]s@Qk@G_AEWMUUS?EQISWeBiDe@m@IYEk@Kq@GOIGICK@CBEJDj@`@l@z@^PXTRFJXn@t@jAVn@Lr@?`@BLNR\\JTNh@dA\\hAXn@lBhDJh@D`AO|BERQZEXQh@GXKTMh@[h@SHIFa@EeA?a@JSL[v@WXOTw@pBGXQTi@EWGmBGiAF_AKIEOK]_@Yq@I]@kBBWDGB?j@Rp@f@XN\\^l@ZrAjAX^`@Tb@Dr@Ol@A@CXELE`@EVMh@OlAS\\Sj@O\\YTENIPE\\UVIl@YNON]NQVGR@\\M`@WT]VQVIRCf@HJCHMJ_@JKP}@DKBCj@DJEBGDS@y@Jg@Bq@Hc@TcAHO`@c@LQBMI]BKbAk@NSLk@D]Ps@lAuHNg@JcADM\\eBb@eBX}@d@}BNe@Z_BHq@HUL_ANa@D_@HSDS\\oAPiAPm@j@{CTo@f@{BTw@Vu@Nw@p@iC@WCm@BQJSHCH?RPHBNEDKP{@La@VqAZy@H_@Fk@Ri@VsA@YPe@Jy@x@uDJs@f@}ADYLWJB~@r@TJd@d@@DSjBEx@@NAFAl@Id@AX",
  photos: ["https://dgtzuqphqg23d.cloudfront.net/3OUIDSXHxntODn0ivFA7Wr74eQmmGrDGWvNGIL1X9xo-768x576.jpg"],
};

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    canvasRef.current!.width = 700;
    canvasRef.current!.height = 700;

    demoDraw(activity, canvasRef.current!);
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}
