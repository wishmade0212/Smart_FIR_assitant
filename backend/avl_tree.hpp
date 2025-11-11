#ifndef AVL_TREE_HPP
#define AVL_TREE_HPP

#include <algorithm>
#include <string>
#include "fir_record.hpp"

class AVLNode {
public:
    int key;
    FIRRecord* value;
    AVLNode* left;
    AVLNode* right;
    int height;

    AVLNode(int k, FIRRecord* v) : key(k), value(v), left(nullptr), right(nullptr), height(1) {}
};

class AVLTree {
private:
    AVLNode* root;

    int height(AVLNode* node) {
        return node ? node->height : 0;
    }

    int getBalance(AVLNode* node) {
        return node ? height(node->left) - height(node->right) : 0;
    }

    AVLNode* rotateRight(AVLNode* y) {
        AVLNode* x = y->left;
        AVLNode* T2 = x->right;

        x->right = y;
        y->left = T2;

        y->height = std::max(height(y->left), height(y->right)) + 1;
        x->height = std::max(height(x->left), height(x->right)) + 1;

        return x;
    }

    AVLNode* rotateLeft(AVLNode* x) {
        AVLNode* y = x->right;
        AVLNode* T2 = y->left;

        y->left = x;
        x->right = T2;

        x->height = std::max(height(x->left), height(x->right)) + 1;
        y->height = std::max(height(y->left), height(y->right)) + 1;

        return y;
    }

    AVLNode* insertNode(AVLNode* node, int key, FIRRecord* value) {
        if (!node) return new AVLNode(key, value);

        if (key < node->key)
            node->left = insertNode(node->left, key, value);
        else if (key > node->key)
            node->right = insertNode(node->right, key, value);
        else {
            node->value = value;
            return node;
        }

        node->height = 1 + std::max(height(node->left), height(node->right));

        int balance = getBalance(node);

        if (balance > 1 && key < node->left->key)
            return rotateRight(node);

        if (balance < -1 && key > node->right->key)
            return rotateLeft(node);

        if (balance > 1 && key > node->left->key) {
            node->left = rotateLeft(node->left);
            return rotateRight(node);
        }

        if (balance < -1 && key < node->right->key) {
            node->right = rotateRight(node->right);
            return rotateLeft(node);
        }

        return node;
    }

    FIRRecord* findNode(AVLNode* node, int key) {
        if (!node) return nullptr;
        if (key == node->key) return node->value;
        if (key < node->key) return findNode(node->left, key);
        return findNode(node->right, key);
    }

public:
    AVLTree() : root(nullptr) {}

    void insert(int key, FIRRecord* value) {
        root = insertNode(root, key, value);
    }

    FIRRecord* find(int key) {
        return findNode(root, key);
    }
};

#endif // AVL_TREE_HPP
