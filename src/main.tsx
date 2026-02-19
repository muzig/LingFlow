import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ReaderPage } from "@/pages/ReaderPage";
import { SavedPage } from "@/pages/SavedPage";
import { VocabularyPage } from "@/pages/VocabularyPage";
import { ReviewPage } from "@/pages/ReviewPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ReaderPage />} />
          <Route path="saved" element={<SavedPage />} />
          <Route path="vocabulary" element={<VocabularyPage />} />
          <Route path="review" element={<ReviewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
