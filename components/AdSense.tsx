"use client";

import { useEffect } from "react";

/**
 * AdSense表示コンポーネント。
 *
 * 【審査通過後にやること】
 * 方法A(推奨・最速): AdSense管理画面で「自動広告」をONにするだけでOK。
 *   このコンポーネントの<ins>タグは使われないが、害はないのでそのままで良い。
 *
 * 方法B(配置を厳密に制御したい場合): AdSense管理画面で「広告ユニットを作成」し、
 *   発行された data-ad-slot の数字IDを下の "auto" と置き換える。
 *   (pushスクリプトは既にこのコンポーネントに実装済み)
 */
export default function AdSense() {
  useEffect(() => {
    try {
      // @ts-expect-error window.adsbygoogle は AdSense のスクリプトが
      // 読み込まれた後に生成されるグローバル変数のため型定義がない
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSenseスクリプト未読み込み(審査前・広告ブロッカー等)の場合は何もしない
    }
  }, []);

  return (
    <div style={box}>
      {/* AdSense */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4630812027939211"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

const box: React.CSSProperties = {
  margin: "16px 0",
  textAlign: "center",
};