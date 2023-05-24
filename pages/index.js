import Image from 'next/image'
import { Inter } from 'next/font/google'
import Head from 'next/head'
// OpenAI APIの「Configuration」「OpenAIApi」をインポート
import { Configuration, OpenAIApi } from "openai"
import { useState } from 'react'


//const inter = Inter({ subsets: ['latin'] })

//アプリ内の情報を内部データとして持つ
export default function Home() {
  //chatGPTに対する質問の入力欄のデータ
  const [message, setMessage] = useState("");
  //chatGPTとの会話データ（入力・出力共に）
  const [messages, setMessages] = useState([]);
  //chatGPTに質問中可の状態
  const [isLoding, setIsLoading] = useState(false);

  //OPENAIAPIのアクセスキー情報を設定
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAPI_KEY,
  });

  // OpenAIApiインスタンス生成
  const openai = new OpenAIApi(configuration);

  /**
   * OPENAPI送信処理（非同期）
   */
  const handleSubmit = async (e) => {
    //
    e.preventDefault();
    //質問中に状態変更
    setIsLoading(true);

    //APIを叩く
    //GPT3.5のモデルに、入力したデータにて質問する。
    const response = await openai.createImage({
      prompt: message,
      n: 1,
      size: "256x256",
    });


    const image_Url = response.data.data[0].url;
    const imgElement = document.getElementById('generatedImage');
    imgElement.src = image_Url;

    //GPTから返された情報を保持しているデータリストに追加する
    //入力情報は"user"
    //GPTからのResponseは"ai"
    setMessages((prevMessages) => [
      //...prevMessages,
      //{sender: "user", text: message},
      //{sender: "ai", text: response.data.choices[0].message?.content},
      //const imageUrl = response.data.image_url;

      // 取得した画像URLをHTMLの<img>要素に設定します。
      // const imgElement = document.getElementById('generatedImage');
      // imgElement.src = image_Url;
    ]);

    //質問完了に状態変更
    setIsLoading(false);
    //入力欄を初期化
    setMessage("");
  };

  // 画面出力
  return (
    <div>
      <Head>
        <title>chatGPTclone</title>
        <meta name="description" content="next app"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-center h-screen">
        <div className="max-w-lg w-full">
          <div style={{height: "650px"}} className="bg-gray-100 w-full p-4 h-96 overflow-scroll rounded-lg">
            <span className="text-center block font-medium text-2xl border-b-2 border-indigo-400 pb-4 mb-3">chatGPT-Clone</span>
            <img id="generatedImage" />
          </div>
          <form className="w-full" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex items-center p-4 bg-gray-100 rounded-b-lg w-full">
              <input 
              type="text" 
              className="flex-1 border-2 py-2 px-4 focus:outline-none rounded-lg focus:border-indigo-400"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              ></input>
              <button type="submit" className="p-2 bg-indigo-400 rounded-lg text-white">{isLoding ? <span>送信中</span>:<span>送信</span>}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
