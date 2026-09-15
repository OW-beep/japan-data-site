"use client";

import { useEffect, useRef, useState } from "react";

/**
 * AdSense表示コンポーネント。
 *
 * 審査中・広告が配信されない間は、空の広告枠が場所だけ確保して
 * 大きな空白ができてしまう問題があったため、Googleが<ins>タグに
 * 付与する data-ad-status(filled/unfilled)を見て、広告が入らな
 * かった場合はコンテナごと折りたたむようにしている。
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
  const insRef = useRef<HTMLModElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      // @ts-expect-error window.adsbygoogle は AdSense のスクリプトが
      // 読み込まれた後に生成されるグローバル変数のため型定義がない
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSenseスクリプト未読み込み(審査前・広告ブロッカー等)の場合は何もしない
      setCollapsed(true);
      return;
    }

    // Googleのスクリプトが data-ad-status="unfilled" を付与するまで
    // 少し時間がかかるため、複数回チェックしてから判定する。
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      const status = insRef.current?.getAttribute("data-ad-status");

      if (status === "filled") {
        clearInterval(timer);
      } else if (status === "unfilled" || attempts >= 10) {
        setCollapsed(true);
        clearInterval(timer);
      }
    }, 400);

    return () => clearInterval(timer);
  }, []);

  if (collapsed) return null;

  return (
    <div style={box}>
      {/* AdSense */}
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", maxHeight: 300, overflow: "hidden" }}
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
  maxHeight: 300,
  overflow: "hidden",
};