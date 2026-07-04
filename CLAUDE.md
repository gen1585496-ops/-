# ナレッジベース自動保存ルール

## 知識の自動保存

会話の中でユーザーに**新しい事実・知識・仕組み**を説明したら、説明後すぐに `/home/user/-/knowledge_base.json` に自動で追加すること。ユーザーが「追加して」と言うまで待たない。

### 保存する対象
- 生き物の生態・行動・生理
- 自然現象・科学的な仕組み
- 歴史・文化・社会に関する事実
- その他、ユーザーが「なぜ？」「何？」と問いかけて得た知識

### 保存しない対象
- 既に `knowledge_base.json` に登録済みのトピック（id が重複するもの）
- Claude Code の操作方法・設定に関する内容
- 単純な作業手順・コードの書き方

### 保存フォーマット

```json
{
  "id": "英語小文字とハイフンのみ（例: bird-feather-structure）",
  "title": "日本語のトピック名",
  "summary": "3〜5文の要点まとめ",
  "quiz_questions": [
    {
      "question": "記述式の問題文",
      "hint": "考えるヒント",
      "answer": "模範解答"
    }
  ],
  "added_date": "YYYY-MM-DD",
  "review_schedule": [
    {"review_number": 1, "due_date": "追加日+1日", "completed": false},
    {"review_number": 2, "due_date": "追加日+4日", "completed": false},
    {"review_number": 3, "due_date": "追加日+11日", "completed": false},
    {"review_number": 4, "due_date": "追加日+25日", "completed": false},
    {"review_number": 5, "due_date": "追加日+55日", "completed": false}
  ]
}
```

### 保存後の処理
1. `topics` 配列に追記
2. `git add knowledge_base.json && git commit -m "Add knowledge: <トピック名>"` を実行
3. `git push -u origin claude/mejiro-summer-plumage-2o2xdf` でプッシュ
4. ユーザーに「〇〇をナレッジベースに保存しました」と1行で伝える（長い説明不要）
