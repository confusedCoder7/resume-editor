import { useState } from "react";
import { enhanceSection, saveResume } from "./Api"; // Api calls(with respective data)

function App() {

  // State is initialized here
  const [resume, setResume] = useState({  //resume object with initial dummy data, update resume based on user inputs
    name: "John Doe",
    summary: "Experienced developer...",
    experience: ["Worked at ABC Corp."],
    education: ["B.Tech from XYZ"],
    skills: ["React", "Python"],
  });
  console.log(resume)

  // to handling file uploads, when user clicks to upload files, onChange causes this to be invoked(pdf/docx), e -> event object
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // e.target points to <input type='file'> specifically first file of files lists, file object 
    if (!file) return;  // if no files selected it returns 

    const extension = file.name.split(".").pop();   //extracting file extension name

    if (extension === "pdf" || extension === "docx") {
      alert(`Mock parsing "${file.name}"...`);

      //parsed content with dummy values
      const dummyResume = {
        name: "Akshay Kumar",
        summary:
          "Motivated software developer with internship experience in React and FastAPI.",
        experience: [
          "Intern at ABC Corp",
          "Freelance Web Dev",
        ],
        education: ["MCA - Modern College Pune", "BCA - XYZ College Pune"],
        skills: ["React", "JavaScript", "Python"],
      };

      setResume(dummyResume);
    } else {
      alert("Only PDF or DOCX allowed!");
    }
  };

  // whenever any change user did make
  const handleChange = (section, value, index = null) => {
    const newResume = { ...resume };   // copying old resume data, to manipulate, can't directly mutate original resume
    console.log(newResume)
    if (index !== null) {     // if index provided means updating experience, education or skill
      newResume[section][index] = value;
    } else {          // otherwise not array wala property ko update
      newResume[section] = value;
    }
    setResume(newResume);     // finally update with newResume UI re-renders
  };

  const handleEnhance  = async (section, index = null) => {
    const content = index !== null ? resume[section][index] : resume[section];
    const res = await enhanceSection(section, content);
    const improved = res.data.enhanced;
    handleChange(section, improved, index); 
  };

  const handleSave = async () => {
    await saveResume(resume);
    alert("Resume saved!");
  };

  // Binary Large Object downloadable file banata hai 
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.json";
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Resume Editor</h1>

      <div className="mb-4">
        <label className=" mb-1 inline-block px-4 py-2 bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-700">
          Upload Resume (.pdf / .docx) 
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />
        </label>
      </div>

      {/* Name */}
      <label className="block font-bold">Name</label>
      <input
        className="border p-2 w-full mb-4"
        value={resume.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      {/* Summary */}
      <label className="block font-bold">Summary</label>
      <textarea
        className="border p-2 w-full"
        value={resume.summary}
        onChange={(e) => handleChange("summary", e.target.value)}
      />
      <button
        className="bg-blue-500 cursor-pointer text-white px-3 py-1 mt-2 mb-4"
        onClick={() => handleEnhance("summary")}
      >
        Enhance with AI
      </button>

      {/* Dynamic Sections */}
      {["experience", "education", "skills"].map((section) => (
        <div key={section}>
          <h2 className="font-bold capitalize mt-4">{section}</h2>
          {resume[section].map((item, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                className="border p-2 w-full"
                value={item}
                onChange={(e) => handleChange(section, e.target.value, idx)}
              />
              <button
                className="bg-green-500 cursor-pointer text-white px-2"
                onClick={() => handleEnhance(section, idx)}
              >
                Enhance
              </button>
            </div>
          ))}
          <button
            className="bg-gray-300 px-3 cursor-pointer py-1 text-sm"
            onClick={() =>
              setResume({
                ...resume,
                [section]: [...resume[section], ""],
              })
            }
          >
            Add
          </button>
        </div>
      ))}

      {/* Buttons */}
      <div className="mt-6 space-x-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 cursor-pointer text-white px-4 py-2"
        >
          Save Resume
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-600 cursor-pointer text-white px-4 py-2"
        >
          Download JSON
        </button>
      </div>
    </div>
  );
}

export default App;
