/**
 * OOP CONCEPTS DEMONSTRATION
 * Smart FIR Assistant - Comprehensive Implementation
 * 
 * This file demonstrates all 4 core OOP concepts:
 * 1. Encapsulation - Data hiding with private members and public methods
 * 2. Abstraction - Hiding complex implementation details
 * 3. Inheritance - Code reuse through parent-child relationships
 * 4. Polymorphism - Same interface, different behaviors
 */

#ifndef OOP_CONCEPTS_HPP
#define OOP_CONCEPTS_HPP

#include <string>
#include <vector>
#include <iostream>
#include <memory>

// ============================================================================
// 1. ENCAPSULATION - Wrapping data and functions into a class
// ============================================================================

/**
 * Law Class - Demonstrates ENCAPSULATION
 * Private data members are hidden from outside access
 * Public methods provide controlled access to private data
 */
class Law {
private:
    // ENCAPSULATED DATA - Cannot be accessed directly from outside
    std::string section;
    std::string title;
    std::string description;
    std::string punishment;
    std::vector<std::string> keywords;
    
protected:
    // Protected data accessible to derived classes
    std::string category;
    
public:
    // Constructor
    Law(const std::string& sec, const std::string& tit, 
        const std::string& desc, const std::string& punish)
        : section(sec), title(tit), description(desc), punishment(punish) {}
    
    // PUBLIC METHODS - Controlled access to private data
    std::string getSection() const { return section; }
    std::string getTitle() const { return title; }
    std::string getDescription() const { return description; }
    std::string getPunishment() const { return punishment; }
    
    // Setter with validation (demonstrates encapsulation benefits)
    void addKeyword(const std::string& keyword) {
        if (!keyword.empty()) {
            keywords.push_back(keyword);
        }
    }
    
    std::vector<std::string> getKeywords() const { return keywords; }
    
    // Virtual function for polymorphism
    virtual void displayInfo() const {
        std::cout << "Law Section: " << section << std::endl;
        std::cout << "Title: " << title << std::endl;
        std::cout << "Description: " << description << std::endl;
        std::cout << "Punishment: " << punishment << std::endl;
    }
    
    virtual ~Law() {}
};


// ============================================================================
// 3. INHERITANCE - Deriving new classes from existing ones
// ============================================================================

/**
 * CriminalLaw Class - Demonstrates INHERITANCE
 * Inherits all properties and methods from Law class
 * Adds criminal-specific features
 */
class CriminalLaw : public Law {
private:
    std::string cognizableStatus; // "Cognizable" or "Non-Cognizable"
    std::string bailableStatus;   // "Bailable" or "Non-Bailable"
    int minPunishment;
    int maxPunishment;
    
public:
    // Constructor calling parent constructor
    CriminalLaw(const std::string& sec, const std::string& tit,
                const std::string& desc, const std::string& punish,
                const std::string& cognizable, const std::string& bailable,
                int minPun, int maxPun)
        : Law(sec, tit, desc, punish),  // Call parent constructor
          cognizableStatus(cognizable), bailableStatus(bailable),
          minPunishment(minPun), maxPunishment(maxPun) {
        category = "Criminal Law";  // Access protected member from parent
    }
    
    // Additional methods specific to criminal law
    std::string getCognizableStatus() const { return cognizableStatus; }
    std::string getBailableStatus() const { return bailableStatus; }
    int getMinPunishment() const { return minPunishment; }
    int getMaxPunishment() const { return maxPunishment; }
    
    // POLYMORPHISM - Override parent's displayInfo()
    void displayInfo() const override {
        Law::displayInfo();  // Call parent method
        std::cout << "Category: Criminal Law" << std::endl;
        std::cout << "Cognizable: " << cognizableStatus << std::endl;
        std::cout << "Bailable: " << bailableStatus << std::endl;
        std::cout << "Sentence: " << minPunishment << "-" << maxPunishment << " years" << std::endl;
    }
};


/**
 * CivilLaw Class - Demonstrates INHERITANCE
 * Another derived class from Law
 */
class CivilLaw : public Law {
private:
    std::string court;        // Which court handles this
    std::string remedyType;   // Compensation, Injunction, etc.
    
public:
    CivilLaw(const std::string& sec, const std::string& tit,
             const std::string& desc, const std::string& remedy,
             const std::string& courtType)
        : Law(sec, tit, desc, "Civil Remedy"),
          remedyType(remedy), court(courtType) {
        category = "Civil Law";
    }
    
    std::string getCourt() const { return court; }
    std::string getRemedyType() const { return remedyType; }
    
    // POLYMORPHISM - Different implementation of displayInfo()
    void displayInfo() const override {
        Law::displayInfo();
        std::cout << "Category: Civil Law" << std::endl;
        std::cout << "Court: " << court << std::endl;
        std::cout << "Remedy: " << remedyType << std::endl;
    }
};


// ============================================================================
// User Base Class - For User Hierarchy
// ============================================================================

/**
 * User Class - Base class demonstrating ENCAPSULATION and INHERITANCE
 */
class User {
protected:
    std::string username;
    std::string email;
    std::string role;
    bool isVerified;
    
public:
    User(const std::string& user, const std::string& mail, const std::string& r)
        : username(user), email(mail), role(r), isVerified(false) {}
    
    // Encapsulated access
    std::string getUsername() const { return username; }
    std::string getEmail() const { return email; }
    std::string getRole() const { return role; }
    bool getVerified() const { return isVerified; }
    
    void setVerified(bool verified) { isVerified = verified; }
    
    // Virtual function for polymorphism
    virtual void displayInfo() const {
        std::cout << "User: " << username << std::endl;
        std::cout << "Email: " << email << std::endl;
        std::cout << "Role: " << role << std::endl;
        std::cout << "Verified: " << (isVerified ? "Yes" : "No") << std::endl;
    }
    
    // Pure virtual function for abstraction
    virtual void performAction() const = 0;  // Must be implemented by derived classes
    
    virtual ~User() {}
};


/**
 * Admin Class - INHERITANCE from User
 */
class Admin : public User {
private:
    int firCreated;
    int firClosed;
    
public:
    Admin(const std::string& user, const std::string& mail)
        : User(user, mail, "Admin"), firCreated(0), firClosed(0) {}
    
    void incrementFIRCreated() { firCreated++; }
    void incrementFIRClosed() { firClosed++; }
    
    int getFIRCreated() const { return firCreated; }
    int getFIRClosed() const { return firClosed; }
    
    // POLYMORPHISM - Different displayInfo()
    void displayInfo() const override {
        User::displayInfo();
        std::cout << "FIRs Created: " << firCreated << std::endl;
        std::cout << "FIRs Closed: " << firClosed << std::endl;
    }
    
    // Implementation of pure virtual function
    void performAction() const override {
        std::cout << "Admin can: Create FIR, Close FIR, View All Records" << std::endl;
    }
};


/**
 * Citizen Class - INHERITANCE from User
 */
class Citizen : public User {
private:
    int complaintsRegistered;
    std::string address;
    
public:
    Citizen(const std::string& user, const std::string& mail, const std::string& addr)
        : User(user, mail, "Citizen"), complaintsRegistered(0), address(addr) {}
    
    void incrementComplaints() { complaintsRegistered++; }
    int getComplaintsRegistered() const { return complaintsRegistered; }
    std::string getAddress() const { return address; }
    
    // POLYMORPHISM - Different displayInfo()
    void displayInfo() const override {
        User::displayInfo();
        std::cout << "Address: " << address << std::endl;
        std::cout << "Complaints Registered: " << complaintsRegistered << std::endl;
    }
    
    // Implementation of pure virtual function
    void performAction() const override {
        std::cout << "Citizen can: File Complaint, View Own FIRs, Search Laws" << std::endl;
    }
};


// ============================================================================
// 2. ABSTRACTION - Hiding implementation details
// ============================================================================

/**
 * FIRRecord Class - Demonstrates ABSTRACTION
 * User just calls fileFIR() without knowing about internal data structures
 */
class FIRRecord {
private:
    std::string firId;
    std::string complainantName;
    std::string suspectName;
    std::string incidentDescription;
    std::string ipcSection;
    std::string dateRegistered;
    std::string status;
    
    // ABSTRACTION - Internal helper methods hidden from user
    std::string generateFIRId() {
        static int counter = 1;
        return "FIR-" + std::to_string(counter++);
    }
    
    bool validateData() {
        return !complainantName.empty() && !incidentDescription.empty();
    }
    
public:
    // Constructor
    FIRRecord(const std::string& complainant, const std::string& suspect,
              const std::string& incident, const std::string& ipc)
        : complainantName(complainant), suspectName(suspect),
          incidentDescription(incident), ipcSection(ipc),
          status("Registered") {
        firId = generateFIRId();
        // Auto-generate date
        time_t now = time(0);
        dateRegistered = ctime(&now);
    }
    
    // ABSTRACTION - Simple public interface
    // User doesn't need to know how FIR is stored or validated
    bool fileFIR() {
        if (validateData()) {
            std::cout << "✅ FIR Filed Successfully: " << firId << std::endl;
            return true;
        }
        std::cout << "❌ FIR Filing Failed: Invalid data" << std::endl;
        return false;
    }
    
    // Getters
    std::string getFIRId() const { return firId; }
    std::string getComplainant() const { return complainantName; }
    std::string getSuspect() const { return suspectName; }
    std::string getStatus() const { return status; }
    
    void updateStatus(const std::string& newStatus) {
        status = newStatus;
    }
    
    // POLYMORPHISM - Can be overridden
    virtual void displayInfo() const {
        std::cout << "═══════════════════════════════════════" << std::endl;
        std::cout << "FIR No: " << firId << std::endl;
        std::cout << "Complainant: " << complainantName << std::endl;
        std::cout << "Suspect: " << suspectName << std::endl;
        std::cout << "IPC Section: " << ipcSection << std::endl;
        std::cout << "Status: " << status << std::endl;
        std::cout << "Date: " << dateRegistered;
        std::cout << "═══════════════════════════════════════" << std::endl;
    }
};


// ============================================================================
// 4. POLYMORPHISM - Same function, different behavior
// ============================================================================

/**
 * LawSearchService - Demonstrates POLYMORPHISM and ABSTRACTION
 * Same searchLaw() interface works with different law types
 */
class LawSearchService {
public:
    // POLYMORPHISM - Works with any Law-derived object
    void searchLaw(const Law* law) const {
        if (law != nullptr) {
            law->displayInfo();  // Calls appropriate version based on actual type
        }
    }
    
    // Overloaded function - Another form of polymorphism
    void searchLaw(const std::string& keyword, const std::vector<Law*>& laws) const {
        std::cout << "\n🔍 Searching for: " << keyword << std::endl;
        std::cout << "════════════════════════════════════════════════\n" << std::endl;
        
        for (const auto& law : laws) {
            for (const auto& kw : law->getKeywords()) {
                if (kw.find(keyword) != std::string::npos) {
                    law->displayInfo();
                    std::cout << std::endl;
                    break;
                }
            }
        }
    }
};


// ============================================================================
// DEMONSTRATION FUNCTION
// ============================================================================

/**
 * Demonstrates all 4 OOP concepts in action
 */
void demonstrateOOPConcepts() {
    std::cout << "\n╔════════════════════════════════════════════════════════╗" << std::endl;
    std::cout << "║   SMART FIR ASSISTANT - OOP CONCEPTS DEMONSTRATION   ║" << std::endl;
    std::cout << "╚════════════════════════════════════════════════════════╝\n" << std::endl;
    
    // ========================================
    // 1. ENCAPSULATION Demo
    // ========================================
    std::cout << "1️⃣  ENCAPSULATION - Data Hiding with Private Members\n" << std::endl;
    std::cout << "Creating a Law object with private data members..." << std::endl;
    Law basicLaw("302", "Murder", "Punishment for murder", "Death or Life Imprisonment");
    basicLaw.addKeyword("kill");
    basicLaw.addKeyword("murder");
    basicLaw.addKeyword("death");
    
    std::cout << "✅ Can access via public methods: " << basicLaw.getSection() << std::endl;
    std::cout << "❌ Cannot access private members directly (protected by class)\n" << std::endl;
    
    // ========================================
    // 3. INHERITANCE Demo
    // ========================================
    std::cout << "3️⃣  INHERITANCE - Code Reuse through Parent-Child Relationship\n" << std::endl;
    std::cout << "Creating CriminalLaw (inherits from Law)..." << std::endl;
    CriminalLaw murder("302", "Murder", "Whoever commits murder", 
                       "Death or Life Imprisonment", "Cognizable", "Non-Bailable", 7, 99);
    murder.addKeyword("kill");
    murder.addKeyword("murder");
    
    std::cout << "✅ CriminalLaw has all Law features PLUS criminal-specific features" << std::endl;
    std::cout << "   - Inherited: section, title, description (from Law)" << std::endl;
    std::cout << "   - New: cognizable status, bailable status (CriminalLaw only)\n" << std::endl;
    
    std::cout << "Creating CivilLaw (also inherits from Law)..." << std::endl;
    CivilLaw property("52", "Property Dispute", "Dispute over property ownership",
                      "Injunction or Compensation", "District Court");
    property.addKeyword("property");
    property.addKeyword("dispute");
    std::cout << "✅ CivilLaw also inherits from Law but adds different features\n" << std::endl;
    
    // ========================================
    // 4. POLYMORPHISM Demo
    // ========================================
    std::cout << "4️⃣  POLYMORPHISM - Same Interface, Different Behaviors\n" << std::endl;
    std::cout << "Calling displayInfo() on different objects:\n" << std::endl;
    
    std::cout << "📋 Basic Law displayInfo():" << std::endl;
    std::cout << "─────────────────────────────────" << std::endl;
    basicLaw.displayInfo();
    
    std::cout << "\n📋 CriminalLaw displayInfo() (extended version):" << std::endl;
    std::cout << "─────────────────────────────────" << std::endl;
    murder.displayInfo();
    
    std::cout << "\n📋 CivilLaw displayInfo() (different version):" << std::endl;
    std::cout << "─────────────────────────────────" << std::endl;
    property.displayInfo();
    
    std::cout << "\n✅ Same function name (displayInfo), different behaviors!\n" << std::endl;
    
    // ========================================
    // 2. ABSTRACTION Demo
    // ========================================
    std::cout << "2️⃣  ABSTRACTION - Hiding Complex Implementation\n" << std::endl;
    std::cout << "Creating FIR Record..." << std::endl;
    FIRRecord fir("Rajesh Kumar", "Unknown", 
                  "Someone stole my motorcycle from parking lot", "379");
    
    std::cout << "\nUser just calls fileFIR():" << std::endl;
    fir.fileFIR();
    std::cout << "\n✅ User doesn't need to know:" << std::endl;
    std::cout << "   - How FIR ID is generated" << std::endl;
    std::cout << "   - How data is validated" << std::endl;
    std::cout << "   - How date is stored" << std::endl;
    std::cout << "   - Internal data structures used\n" << std::endl;
    
    fir.displayInfo();
    
    // ========================================
    // User Hierarchy Demo
    // ========================================
    std::cout << "\n👥 USER HIERARCHY - Inheritance & Polymorphism\n" << std::endl;
    
    Admin admin("OfficerSharma", "sharma@police.gov.in");
    admin.setVerified(true);
    admin.incrementFIRCreated();
    admin.incrementFIRCreated();
    
    Citizen citizen("RajeshKumar", "rajesh@email.com", "123 MG Road, Mumbai");
    citizen.setVerified(true);
    citizen.incrementComplaints();
    
    std::cout << "📋 Admin Info:" << std::endl;
    std::cout << "─────────────────────────────────" << std::endl;
    admin.displayInfo();
    admin.performAction();
    
    std::cout << "\n📋 Citizen Info:" << std::endl;
    std::cout << "─────────────────────────────────" << std::endl;
    citizen.displayInfo();
    citizen.performAction();
    
    // ========================================
    // Polymorphic Search Service
    // ========================================
    std::cout << "\n🔍 LAW SEARCH SERVICE - Polymorphism in Action\n" << std::endl;
    
    std::vector<Law*> lawDatabase;
    lawDatabase.push_back(&murder);
    lawDatabase.push_back(&property);
    
    LawSearchService searchService;
    searchService.searchLaw("murder", lawDatabase);
    
    std::cout << "\n╔════════════════════════════════════════════════════════╗" << std::endl;
    std::cout << "║              OOP CONCEPTS DEMONSTRATION COMPLETE        ║" << std::endl;
    std::cout << "╚════════════════════════════════════════════════════════╝\n" << std::endl;
}

#endif // OOP_CONCEPTS_HPP
