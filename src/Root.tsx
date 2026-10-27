import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import {
  PayoutBatman,
  DURATION as PAYOUT_BATMAN_DURATION,
  FPS as PAYOUT_BATMAN_FPS,
} from "./payout-batman/PayoutBatman";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="PayoutBatman"
        component={PayoutBatman}
        durationInFrames={PAYOUT_BATMAN_DURATION}
        fps={PAYOUT_BATMAN_FPS}
        width={1080}
        height={1920}
        defaultProps={{ beatGuide: true }}
      />
    </>
  );
};
