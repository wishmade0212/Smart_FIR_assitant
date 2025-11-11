# 🤖 AI API Integration Guide for IPC Search

## Problem
Currently, IPC sections are hardcoded in `ipc_store.hpp` and `ipc_data.js`. This is not scalable or maintainable.

## ✅ Recommended Solution: Use AI APIs

### **Option 1: OpenAI GPT API** (Best for Natural Language)
**Cost**: Free tier available ($5 credit for new accounts)
**Best for**: Natural language understanding of legal queries

```cpp
// Example: User types "kill" → AI explains relevant IPC sections
POST https://api.openai.com/v1/chat/completions
Headers: 
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json

Body:
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "You are a legal assistant for Indian Penal Code. When given a keyword or scenario, provide relevant IPC sections with section number, title, description, and punishment. Format response as JSON."
    },
    {
      "role": "user",
      "content": "kill"
    }
  ],
  "temperature": 0.3
}
```

**Pros**: 
- Understands context ("someone tried to kill me" vs "kill insects")
- Can explain in simple language
- Handles complex queries

**Cons**: 
- Requires API key
- Small free tier (after $5 credit, paid)

---

### **Option 2: Groq API** (⭐ Recommended - Fast & Free)
**Cost**: **FREE** (generous limits)
**Speed**: Ultra-fast inference
**Best for**: Real-time IPC search with AI reasoning

```bash
# Get free API key: https://console.groq.com/
```

```javascript
// Frontend implementation example
async function searchIPCWithAI(keyword) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_GROQ_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768', // or 'llama2-70b-4096'
      messages: [
        {
          role: 'system',
          content: `You are an expert on Indian Penal Code (IPC). 
                    When given a keyword or scenario, return relevant IPC sections.
                    Response format: JSON array with {section, title, description, punishment, keywords[]}`
        },
        {
          role: 'user',
          content: keyword
        }
      ],
      temperature: 0.2,
      max_tokens: 1000
    })
  });
  
  return await response.json();
}
```

**Pros**:
- ✅ Completely FREE with high limits
- ✅ Very fast (faster than OpenAI)
- ✅ Multiple models available
- ✅ Compatible with OpenAI API format

**Cons**:
- Requires internet connection
- API key needed (free to get)

---

### **Option 3: Hugging Face Inference API** (Free & Open Source)
**Cost**: FREE
**Best for**: Open-source models, privacy-conscious

```javascript
async function searchIPCWithHuggingFace(keyword) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/google/flan-t5-large',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_HF_TOKEN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: `List relevant Indian Penal Code sections for: ${keyword}. 
                 Include section number, title, and punishment.`
      })
    }
  );
  
  return await response.json();
}
```

**Get free token**: https://huggingface.co/settings/tokens

**Pros**:
- ✅ Completely free
- ✅ No rate limits
- ✅ Multiple models to choose from
- ✅ Open source

---

### **Option 4: Google Gemini API** (Free Tier)
**Cost**: FREE (60 requests/minute)
**Best for**: Multimodal capabilities (text + images)

```javascript
async function searchIPCWithGemini(keyword) {
  const API_KEY = 'YOUR_GEMINI_API_KEY';
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `As a legal expert, list Indian Penal Code sections related to: "${keyword}". 
                   Return JSON: [{section, title, description, punishment, keywords[]}]`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024
        }
      })
    }
  );
  
  return await response.json();
}
```

**Get API key**: https://makersuite.google.com/app/apikey

---

### **Option 5: Cohere API** (Free Tier)
**Cost**: FREE (100 API calls/month)
**Best for**: Semantic search and classification

```javascript
async function searchIPCWithCohere(keyword) {
  const response = await fetch('https://api.cohere.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_COHERE_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'command',
      prompt: `Given the keyword or scenario: "${keyword}", 
               list relevant Indian Penal Code (IPC) sections with details.`,
      max_tokens: 500,
      temperature: 0.3
    })
  });
  
  return await response.json();
}
```

---

## 🏆 **My Top Recommendation**

### **Use Groq API + Fallback to Static Data**

**Why?**
1. ✅ FREE with generous limits
2. ✅ Lightning fast (fastest AI inference)
3. ✅ Easy integration (OpenAI-compatible)
4. ✅ If API fails, fall back to static IPC data
5. ✅ Can update IPC database automatically

---

## 📦 Implementation Plan

### **Step 1: Add AI API Integration to Backend**

Create new file: `backend/ai_ipc_service.hpp`

```cpp
#ifndef AI_IPC_SERVICE_HPP
#define AI_IPC_SERVICE_HPP

#include <string>
#include <vector>
#include <curl/curl.h>
#include "fir_record.hpp"
#include "ipc_store.hpp"

class AIIPCService {
private:
    std::string apiKey;
    std::string apiEndpoint = "https://api.groq.com/openai/v1/chat/completions";
    IPCStore* fallbackStore; // Static data as fallback
    
    static size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {
        ((std::string*)userp)->append((char*)contents, size * nmemb);
        return size * nmemb;
    }

public:
    AIIPCService(const std::string& key, IPCStore* fallback) 
        : apiKey(key), fallbackStore(fallback) {}
    
    std::vector<IPCSection> searchWithAI(const std::string& keyword) {
        CURL* curl = curl_easy_init();
        if (!curl) {
            return fallbackStore->searchByKeyword(keyword); // Fallback
        }
        
        std::string readBuffer;
        std::string jsonPayload = R"({
            "model": "mixtral-8x7b-32768",
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert on Indian Penal Code. Return relevant IPC sections as JSON array with fields: section, title, description, punishment, keywords[]"
                },
                {
                    "role": "user",
                    "content": ")" + keyword + R"("
                }
            ],
            "temperature": 0.2
        })";
        
        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, ("Authorization: Bearer " + apiKey).c_str());
        headers = curl_slist_append(headers, "Content-Type: application/json");
        
        curl_easy_setopt(curl, CURLOPT_URL, apiEndpoint.c_str());
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, jsonPayload.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
        
        CURLcode res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);
        curl_slist_free_all(headers);
        
        if (res != CURLE_OK) {
            return fallbackStore->searchByKeyword(keyword); // Fallback on error
        }
        
        // Parse JSON response and return IPCSections
        // (Implementation depends on JSON parsing library)
        return parseAIResponse(readBuffer);
    }
    
    std::vector<IPCSection> parseAIResponse(const std::string& jsonResponse) {
        // TODO: Parse JSON and extract IPC sections
        // For now, return fallback
        return {};
    }
};

#endif
```

---

### **Step 2: Frontend Integration (Easier!)**

Update `app_api.js`:

```javascript
// Configuration
const GROQ_API_KEY = 'gsk_YOUR_KEY_HERE'; // Get from https://console.groq.com
const USE_AI = true; // Set to false to use static data

async function searchIPCWithAI(keyword) {
    if (!USE_AI || !GROQ_API_KEY) {
        // Fallback to static backend
        return fetch(`${API_BASE_URL}/ipc/search?keyword=${keyword}`);
    }
    
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert on Indian Penal Code (IPC). 
                                  When given a keyword, return ONLY a valid JSON array of relevant IPC sections.
                                  Format: [{"section": "302", "title": "Murder", "description": "...", 
                                           "punishment": "...", "keywords": ["kill", "murder"]}]
                                  Return ONLY the JSON array, no explanation.`
                    },
                    {
                        role: 'user',
                        content: keyword
                    }
                ],
                temperature: 0.2,
                max_tokens: 1500
            })
        });
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Parse AI response
        const sections = JSON.parse(content);
        return { success: true, sections };
        
    } catch (error) {
        console.error('AI API failed, using static data:', error);
        // Fallback to backend static data
        return fetch(`${API_BASE_URL}/ipc/search?keyword=${keyword}`).then(r => r.json());
    }
}

// Update your existing IPC search to use AI
async function handleIPCSearch(keyword) {
    const result = await searchIPCWithAI(keyword);
    displayIPCSections(result.sections);
}
```

---

## 🎯 **Quick Start: 5-Minute Setup**

### **Option A: Frontend-Only (Easiest)**

1. **Get Groq API Key** (30 seconds):
   - Visit: https://console.groq.com
   - Sign up (free)
   - Copy API key

2. **Update `app_api.js`**:
   ```javascript
   const GROQ_API_KEY = 'gsk_your_key_here';
   ```

3. **Done!** Now when users type "kill", AI responds with relevant IPC sections

### **Option B: Backend Integration (Better)**

Same as above, but implement in `server.cpp` so API key is hidden from frontend.

---

## 🔒 **Security Best Practices**

1. **Never expose API keys in frontend code**
   - Store in backend environment variables
   - Create proxy endpoint: `/api/ipc/ai-search`

2. **Add rate limiting**
   ```cpp
   // Limit to 10 requests per minute per user
   ```

3. **Cache AI responses**
   ```cpp
   // Store common queries in Redis/memory
   std::unordered_map<string, vector<IPCSection>> cache;
   ```

---

## 📊 **Comparison Table**

| API | Cost | Speed | Accuracy | Setup | Recommendation |
|-----|------|-------|----------|-------|----------------|
| **Groq** | FREE | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐ | Easy | ✅ **BEST** |
| OpenAI | $5 free | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Easy | Good |
| Gemini | FREE | ⚡⚡⚡ | ⭐⭐⭐⭐ | Easy | Good |
| Hugging Face | FREE | ⚡⚡ | ⭐⭐⭐ | Medium | Budget |
| Cohere | FREE (limited) | ⚡⚡⚡ | ⭐⭐⭐ | Easy | Limited |

---

## 🚀 **Next Steps**

1. Choose API (I recommend **Groq**)
2. Get free API key
3. Implement frontend integration first (5 minutes)
4. Test with queries: "kill", "theft", "fraud", "assault"
5. Move to backend integration for security
6. Add caching for performance

---

## 📝 **Example Implementation File**

I can create a complete working example with:
- ✅ Groq API integration
- ✅ Fallback to static data
- ✅ Error handling
- ✅ Caching
- ✅ Rate limiting

Want me to create the implementation files?
