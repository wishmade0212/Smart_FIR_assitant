#ifndef IPC_STORE_HPP
#define IPC_STORE_HPP

#include <vector>
#include <unordered_set>
#include "fir_record.hpp"
#include "trie.hpp"

class IPCStore {
private:
    std::vector<IPCSection> sections;
    Trie keywordTrie;

    void initializeSections() {
        sections = {
            {"302", "Murder", "Punishment for murder", {"kill", "murder", "death", "homicide", "killing"}, "Death or life imprisonment"},
            {"304", "Culpable homicide not amounting to murder", "Punishment for culpable homicide", {"kill", "death", "homicide", "culpable"}, "Imprisonment up to 10 years or life"},
            {"307", "Attempt to murder", "Attempt to commit murder", {"attempt", "kill", "murder", "try to kill"}, "Imprisonment up to 10 years"},
            {"323", "Punishment for voluntarily causing hurt", "Causing hurt voluntarily", {"hurt", "assault", "hit", "beat", "attack", "injury"}, "Imprisonment up to 1 year or fine"},
            {"324", "Voluntarily causing hurt by dangerous weapons", "Causing hurt with dangerous weapons", {"hurt", "weapon", "knife", "assault", "attack"}, "Imprisonment up to 3 years"},
            {"325", "Punishment for voluntarily causing grievous hurt", "Causing grievous hurt", {"hurt", "grievous", "serious injury", "assault"}, "Imprisonment up to 7 years"},
            {"354", "Assault or criminal force to woman", "Assault or criminal force with intent to outrage modesty", {"assault", "woman", "modesty", "molestation", "harassment"}, "Imprisonment up to 2 years"},
            {"376", "Punishment for rape", "Sexual assault", {"rape", "sexual assault", "sexual violence"}, "Imprisonment not less than 10 years, may extend to life"},
            {"379", "Punishment for theft", "Theft of movable property", {"theft", "steal", "stealing", "rob", "loot"}, "Imprisonment up to 3 years or fine"},
            {"380", "Theft in dwelling house", "Theft in a building used as dwelling", {"theft", "burglary", "house theft", "steal from house"}, "Imprisonment up to 7 years"},
            {"392", "Punishment for robbery", "Robbery or dacoity", {"robbery", "rob", "dacoity", "armed theft", "loot"}, "Imprisonment up to 10 years"},
            {"420", "Cheating and dishonestly inducing delivery of property", "Cheating", {"cheat", "fraud", "deception", "dishonest", "scam"}, "Imprisonment up to 7 years"},
            {"425", "Mischief", "Causing damage to property", {"damage", "vandalism", "mischief", "destroy property"}, "Imprisonment up to 3 months or fine"},
            {"427", "Mischief causing damage", "Mischief causing damage to property", {"damage", "vandalism", "property damage"}, "Imprisonment up to 2 years or fine"},
            {"504", "Intentional insult", "Intentional insult to provoke breach of peace", {"insult", "provoke", "abuse", "verbal abuse"}, "Imprisonment up to 2 years or fine"},
            {"506", "Punishment for criminal intimidation", "Criminal intimidation", {"threat", "intimidation", "threaten", "blackmail"}, "Imprisonment up to 2 years or fine"},
            {"511", "Punishment for attempting to commit offences", "Attempting to commit offences punishable with imprisonment", {"attempt", "trying to commit"}, "Half of longest term for the offence"}
        };
        
        buildIndex();
    }

    void buildIndex() {
        for (size_t idx = 0; idx < sections.size(); ++idx) {
            for (const auto& kw : sections[idx].keywords) {
                keywordTrie.insert(kw, static_cast<int>(idx));
            }
        }
    }

public:
    IPCStore() {
        initializeSections();
    }

    std::vector<IPCSection> searchByKeyword(const std::string& query) {
        std::vector<int> indices = keywordTrie.startsWith(query);
        std::unordered_set<int> uniqueIndices(indices.begin(), indices.end());
        
        std::vector<IPCSection> results;
        for (int idx : uniqueIndices) {
            if (idx >= 0 && idx < static_cast<int>(sections.size())) {
                results.push_back(sections[idx]);
            }
        }
        return results;
    }

    std::vector<IPCSection> getAll() {
        return sections;
    }

    IPCSection* getBySection(const std::string& sec) {
        for (auto& section : sections) {
            if (section.section == sec) {
                return &section;
            }
        }
        return nullptr;
    }
};

#endif // IPC_STORE_HPP
