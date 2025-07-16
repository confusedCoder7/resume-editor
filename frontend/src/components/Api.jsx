import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const enhanceSection = (section, content) =>
  API.post("/ai-enhance", { section, content });

export const saveResume = (resume) =>
  API.post("/save-resume", { resume });