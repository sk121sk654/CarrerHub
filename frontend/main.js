const questions = [
  {
    question: "What is a binary search?",
    answer:
      "A divide and conquer algorithm that finds the position of a target value within a sorted array.",
    category: "DSA",
    company: "Amazon",
    difficulty: "Easy",
  },
  {
    question: "Explain CAP theorem.",
    answer:
      "It states that a distributed system can provide only two out of the following three: Consistency, Availability, Partition Tolerance.",
    category: "System Design",
    company: "Google",
    difficulty: "Hard",
  },
  {
    question: "Tell me about a time you handled conflict in a team.",
    answer:
      "Share a specific story using the STAR method: Situation, Task, Action, Result.",
    category: "Behavioral",
    company: "Amazon",
    difficulty: "Medium",
  },
  // DSA
  {
    question: "Explain the difference between a stack and a queue.",
    category: "DSA",
    company: "Amazon",
    difficulty: "Easy",
    answer:
      "Stack follows LIFO (Last In First Out), while queue follows FIFO (First In First Out).",
  },
  {
    question: "Given an array, find the first missing positive number.",
    category: "DSA",
    company: "Google",
    difficulty: "Medium",
    answer:
      "Use a hash set or in-place swapping to find the missing number in O(n) time.",
  },
  {
    question: "Implement a trie (prefix tree).",
    category: "DSA",
    company: "Google",
    difficulty: "Hard",
    answer:
      "Create a TrieNode class with children and isEnd flag; insert and search recursively.",
  },
  {
    question: "Detect a cycle in a linked list.",
    category: "DSA",
    company: "Amazon",
    difficulty: "Easy",
    answer: "Use Floyd’s Cycle Detection Algorithm (Tortoise and Hare).",
  },
  {
    question: "Find the longest palindromic substring in a given string.",
    category: "DSA",
    company: "Google",
    difficulty: "Medium",
    answer: "Use dynamic programming or expand-around-center approach.",
  },

  // System Design
  {
    question: "How would you design a URL shortening service like bit.ly?",
    category: "System Design",
    company: "Google",
    difficulty: "Medium",
    answer:
      "Discuss unique ID generation, hashing, database sharding, and redirection.",
  },
  {
    question: "Design a scalable chat application.",
    category: "System Design",
    company: "Amazon",
    difficulty: "Hard",
    answer:
      "Include message queues, socket connections, load balancing, and persistence.",
  },
  {
    question: "Explain CAP Theorem.",
    category: "System Design",
    company: "Amazon",
    difficulty: "Easy",
    answer:
      "In a distributed system, you can only guarantee two of Consistency, Availability, and Partition Tolerance.",
  },

  // Behavioral
  {
    question: "Tell me about a time you handled a conflict in a team.",
    category: "Behavioral",
    company: "Amazon",
    difficulty: "Easy",
    answer:
      "Use STAR format: Situation, Task, Action, Result to explain your story.",
  },
  {
    question: "Describe a challenging project you worked on.",
    category: "Behavioral",
    company: "Google",
    difficulty: "Medium",
    answer:
      "Describe the challenge, your role, key decisions made, and outcome achieved.",
  },
  {
    question: "Why should we hire you?",
    category: "Behavioral",
    company: "Amazon",
    difficulty: "Easy",
    answer:
      "Talk about relevant skills, passion for the role, and unique value you bring.",
  },
];

let flashcardMode = false;

// === Job Filtering & Save Toggle ===
function saveJob(button) {
  const card = button.closest(".step-card");
  const title = card.querySelector("p").textContent.trim();

  let saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");

  if (saved.includes(title)) {
    saved = saved.filter((job) => job !== title);
    button.textContent = "⭐ Save Job";
    button.classList.remove("saved");
  } else {
    saved.push(title);
    button.textContent = "✅ Saved";
    button.classList.add("saved");
  }

  localStorage.setItem("savedJobs", JSON.stringify(saved));
}

function clearFilters() {
  document.getElementById("skillInput").value = "";
  document.getElementById("locationInput").value = "";
  document.getElementById("typeSelect").value = "";

  document.querySelectorAll(".step-card").forEach((card) => {
    card.style.display = "block";
  });

  const notice = document.getElementById("noResultsMessage");
  if (notice) notice.style.display = "none";
}

function showAllJobs() {
  document.querySelectorAll(".step-card").forEach((job) => {
    job.style.display = "block";
  });

  document.getElementById("skillInput").value = "";
  document.getElementById("locationInput").value = "";
  document.getElementById("typeSelect").value = "";

  const notice = document.getElementById("noResultsMessage");
  if (notice) notice.style.display = "none";
}

function filterJobs() {
  const skill = document
    .getElementById("skillInput")
    .value.trim()
    .toLowerCase();
  const location = document
    .getElementById("locationInput")
    .value.trim()
    .toLowerCase();
  const type = document.getElementById("typeSelect").value.trim().toLowerCase();

  const jobs = document.querySelectorAll(".step-card");
  let matchFound = false;

  jobs.forEach((job) => {
    const jobSkill = job.dataset.skills || "";
    const jobLocation = job.dataset.location || "";
    const jobType = job.dataset.type || "";

    const matchesSkill = !skill || jobSkill.includes(skill);
    const matchesLocation = !location || jobLocation.includes(location);
    const matchesType = !type || jobType === type;

    if (matchesSkill && matchesLocation && matchesType) {
      job.style.display = "block";
      matchFound = true;
    } else {
      job.style.display = "none";
    }
  });

  const notice = document.getElementById("noResultsMessage");
  notice.style.display = matchFound ? "none" : "block";
}

// === Chatbot Logic ===
let botMode = "chat"; // default

function setMode(mode) {
  botMode = mode;
  document
    .getElementById("chatMode")
    .classList.toggle("active-mode", mode === "chat");
  document
    .getElementById("interviewMode")
    .classList.toggle("active-mode", mode === "interview");

  const botMsg = document.createElement("div");
  botMsg.className = "chat-message bot";
  botMsg.textContent = `🔁 Switched to ${
    mode === "chat" ? "Chat" : "Interview"
  } Mode.`;
  document.getElementById("chatBox").appendChild(botMsg);
  scrollToBottom();
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (!message) return;

  const chatBox = document.getElementById("chatBox");

  const userMsg = document.createElement("div");
  userMsg.className = "chat-message user";
  userMsg.textContent = message;
  chatBox.appendChild(userMsg);

  const botMsg = document.createElement("div");
  botMsg.className = "chat-message bot";
  botMsg.textContent = "Thinking...";
  chatBox.appendChild(botMsg);

  scrollToBottom();

  fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, mode: botMode }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.reply) {
        typeBotMessage(botMsg, data.reply);
      } else {
        botMsg.textContent = "⚠️ No response received (empty reply).";
      }
    })
    .catch((err) => {
      console.error("Chat error:", err);
      botMsg.textContent = "⚠️ Something went wrong while contacting the AI.";
    });

  input.value = "";
}

function typeBotMessage(botMsgEl, fullText) {
  botMsgEl.textContent = "";
  let index = 0;
  const typing = setInterval(() => {
    botMsgEl.textContent += fullText[index];
    index++;
    scrollToBottom();
    if (index >= fullText.length) clearInterval(typing);
  }, 20);
}

function scrollToBottom() {
  const box = document.getElementById("chatBox");
  box.scrollTop = box.scrollHeight;
}

function clearChat() {
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML =
    '<div class="chat-message bot">Hi! I\'m your AI interviewer. Ask me anything or type "Start interview".</div>';
  scrollToBottom();
}

function startVoiceInput() {
  const input = document.getElementById("chatInput");
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice input not supported in this browser.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const speechText = event.results[0][0].transcript;
    input.value = speechText;
    input.focus();
  };

  recognition.onerror = (event) => {
    alert("Voice input failed: " + event.error);
  };

  recognition.start();
}

// === DOM Ready ===
// Enable PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
document.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
  document.querySelectorAll(".step-card").forEach((card) => {
    const title = card.querySelector("p").textContent.trim();
    const button = card.querySelector("button");
    if (saved.includes(title)) {
      button.textContent = "✅ Saved";
      button.classList.add("saved");
    }
  });

  const input = document.getElementById("chatInput");
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  document
    .getElementById("job-filter-form")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      filterJobs();
    });
});

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("dashboard-summary")) {
    // ROADMAP PROGRESS
    const totalSteps = Object.keys(localStorage).filter((key) =>
      key.includes("-step-")
    );
    const completed = totalSteps.filter(
      (key) => localStorage.getItem(key) === "true"
    );
    document.getElementById("roadmapCount").textContent = completed.length;

    // SAVED JOBS
    const savedJobsList = document.getElementById("savedJobsList");
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

    if (savedJobs.length === 0) {
      savedJobsList.innerHTML = "<li>No saved jobs yet.</li>";
    } else {
      savedJobs.forEach((job) => {
        const li = document.createElement("li");
        li.textContent = job;
        savedJobsList.appendChild(li);
      });
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step-card");

  steps.forEach((step, i) => {
    const checkbox = step.querySelector(".roadmap-check");
    const stepId = `${location.pathname}-step-${i}`;
    const saved = localStorage.getItem(stepId);

    if (checkbox && saved) {
      checkbox.checked = true;
      step.classList.add("step-done");
    }

    checkbox?.addEventListener("change", () => {
      const done = checkbox.checked;
      const title = step.querySelector("p")?.innerText;

      if (done && title) {
        localStorage.setItem(stepId, title); // ✅ Save the step name
      } else {
        localStorage.removeItem(stepId); // ❌ Remove from storage
      }

      step.classList.toggle("step-done", done);
    });
  });
});

// Show/hide back to top button
window.addEventListener("scroll", () => {
  const button = document.querySelector(".back-to-top");
  if (window.scrollY > 250) {
    button.classList.add("show");
  } else {
    button.classList.remove("show");
  }
});

// Smooth scroll to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// resume section
function formatBulletList(text) {
  return text
    .split(/\n(?=\d+\.|\•|\-)/) // Split at numbered or bulleted points
    .map((item) => `<div class="ai-tip-item">👉 ${item.trim()}</div>`)
    .join("");
}

function renderStructuredTips(tips) {
  const gapResults = document.getElementById("gapResults");
  const html = tips
    .map(
      (tip) => `
    <div class="tip-box">
      <h4>✅ ${tip.title}</h4>
      <p><strong>Summary:</strong> ${tip.summary}</p>
      <p><em>Why it matters:</em> ${tip.reason}</p>
    </div>
  `
    )
    .join("");

  gapResults.innerHTML = `
    <div class="tips-container">${html}</div>
  `;
}


async function analyzeResumeWithAI() {
  const input = document.getElementById("resumeInput");
  const file = input.files[0];
  const resultDiv = document.getElementById("resumeAIResult");

  if (!file) {
    resultDiv.textContent = "❌ Please upload a resume PDF.";
    return;
  }

  resultDiv.innerHTML = "⏳ Processing resume...";

  const reader = new FileReader();
  reader.onload = async function () {
    const typedArray = new Uint8Array(reader.result);
    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }

    // API request to OpenRouter
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
         
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openchat/openchat-7b:free",
          messages: [
            {
              role: "system",
              content:
                "You're a resume expert. Analyze this resume and give smart, actionable tips for improvement.",
            },
            { role: "user", content: text },
          ],
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      resultDiv.innerHTML =
        "✅ Analysis complete!<br><br>" + data.choices[0].message.content;
    } else {
      resultDiv.textContent = "❌ Error: " + data.error.message;
    }
  };

  reader.readAsArrayBuffer(file);
}


async function analyzeSkillGap() {
  const resumeFile = document.getElementById("resumeFile").files[0];
  const jobDesc = document.getElementById("jobDesc").value.trim();
  const gapResults = document.getElementById("gapResults");
  const loadingText = document.getElementById("gapLoading");

  if (!resumeFile || !jobDesc) {
    gapResults.innerHTML =
      "<p style='color:red;'>Please upload a resume and paste a job description.</p>";
    return;
  }

  loadingText.style.display = "block";
  gapResults.innerHTML = "";

  const reader = new FileReader();
  reader.onload = async function () {
    const resumeText = reader.result;

    try {
      const requestBody = {
        model: "openchat/openchat-7b:free",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that provides a clear list of resume improvements.",
          },
          {
            role: "user",
            // content: `Compare the following resume with this job description and return key improvement tips as a JSON array with title, summary, and reason fields only:\n\nResume:\n${resumeText}\n\nJob Description:\n${jobDesc}`
            content: `Compare the following resume with this job description and return key improvement suggestions. Each suggestion should include:
              1. A short title,
2. A detailed explanation,
3. Why it matters.
Return the result as a well-formatted bullet-point list.`,
          },
        ],
      };

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      const aiText =
        result.choices?.[0]?.message?.content || "No response from AI.";

      try {
        // Try to parse AI response as JSON array
        const tips = JSON.parse(content);
        renderStructuredTips(tips);
      } catch (err) {
        // Fallback to plain text display
        gapResults.innerHTML = `
        <div class="ai-suggestion-box">
          <h2>✅ AI Suggestions</h2>
          <div class="ai-list">${formatBulletList(aiText)}</div>
        </div>
      `;
      }
    } catch (error) {
      gapResults.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    } finally {
      loadingText.style.display = "none";
    }
  };

  reader.readAsText(resumeFile);
}

async function fetchJobDescription() {
  const query = document.getElementById("jobSearchQuery").value.trim();
  const jobDescBox = document.getElementById("jobDesc");

  if (!query) return alert("Please enter a job title or keyword.");

  try {
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
        query
      )}&num_pages=1`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "xxxxxx", // 🔐 Replace with your actual key
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      }
    );

    const data = await response.json();
    const job = data.data?.[0]; // Grab first result

    if (job?.job_description) {
      jobDescBox.value = job.job_description;
    } else {
      jobDescBox.value = "❌ No job description found for this query.";
    }
  } catch (err) {
    jobDescBox.value = `⚠️ Error fetching job description: ${err.message}`;
  }
}

// Extract PDF Text using pdf.js
async function extractTextFromPDF(file) {
  const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item) => item.str).join(" ");
    fullText += text + " ";
  }

  return fullText;
}

// Basic Skill Extraction using keyword matching
function extractSkills(text) {
  const predefinedSkills = [
    "JavaScript",
    "Python",
    "HTML",
    "CSS",
    "React",
    "Node.js",
    "SQL",
    "MongoDB",
    "Java",
    "C++",
    "Git",
    "AWS",
    "Docker",
    "Kubernetes",
    "Machine Learning",
    "Data Analysis",
    "REST API",
    "Agile",
    "Excel",
    "Communication",
  ];

  const normalizedText = text.toLowerCase().replace(/[^\w\s.+]/g, " "); // remove symbols except tech symbols
  return predefinedSkills.filter((skill) => {
    const skillVariants = [skill, skill.replace(/\+/g, "plus")];
    return skillVariants.some((variant) =>
      normalizedText.includes(variant.toLowerCase())
    );
  });
}

function showCompanyInsights(company) {
  document.getElementById("modalCompany").innerText = company;
  const modalContent = document.getElementById("modalContent");

  const insights = {
    CodeCraft: {
      rating: "4.4 ⭐",
      salary: "$1,000/mo (internship)",
      difficulty: "Medium",
      questions: ["CSS Grid vs Flexbox?", "React lifecycle methods"],
      culture: "Creative environment, flexible work hours.",
    },
    "AI Labs": {
      rating: "4.7 ⭐",
      salary: "$1,500–$2,000/mo",
      difficulty: "High",
      questions: ["Explain backpropagation", "TensorFlow vs PyTorch"],
      culture: "Research-focused, collaborative teams.",
    },
    WriteWise: {
      rating: "3.9 ⭐",
      salary: "$800/mo",
      difficulty: "Easy",
      questions: ["What is SEO?", "How do you write engaging content?"],
      culture: "Content-driven, flexible deadlines.",
    },
    // Add more companies as needed
  };

  const info = insights[company] || {
    rating: "N/A",
    salary: "N/A",
    difficulty: "N/A",
    questions: ["No available questions."],
    culture: "No data available yet.",
  };

  modalContent.innerHTML = `
    <p><strong>Rating:</strong> ${info.rating}</p>
    <p><strong>Average Salary:</strong> ${info.salary}</p>
    <p><strong>Interview Difficulty:</strong> ${info.difficulty}</p>
    <p><strong>Sample Questions:</strong></p>
    <ul>${info.questions.map((q) => `<li>${q}</li>`).join("")}</ul>
    <p><strong>Company Culture:</strong> ${info.culture}</p>
  `;

  document.getElementById("companyModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("companyModal").classList.add("hidden");
}

function displayQuestions(filtered = questions) {
  const container = document.getElementById("questionContainer");
  container.innerHTML = "";

  filtered.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = flashcardMode
      ? "question-card flashcard"
      : "question-card";
    card.innerHTML = `
              <strong>Q${index + 1}: ${q.question}</strong>
              <p class="answer">${q.answer}</p>
              <p><small>${q.category} • ${q.company} • ${
      q.difficulty
    }</small></p>
            `;
    if (flashcardMode) {
      card.onclick = () => card.classList.toggle("flipped");
    }
    container.appendChild(card);
  });
}

function filterQuestions() {
  const cat = document.getElementById("filterCategory").value;
  const comp = document.getElementById("filterCompany").value;
  const diff = document.getElementById("filterDifficulty").value;

  const filtered = questions.filter((q) => {
    return (
      (!cat || q.category === cat) &&
      (!comp || q.company === comp) &&
      (!diff || q.difficulty === diff)
    );
  });

  displayQuestions(filtered);
}

function toggleFlashcardMode() {
  flashcardMode = !flashcardMode;
  displayQuestions();
}

window.onload = () => {
  displayQuestions();
};
