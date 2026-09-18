import { RepoFile, AstNode } from "../types";

export const INITIAL_FILES: RepoFile[] = [
  {
    path: "src/auth/jwt_service.go",
    name: "jwt_service.go",
    language: "go",
    sizeBytes: 1840,
    astNodesCount: 14,
    content: `package auth

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	ErrInvalidToken = errors.New("invalid or expired authentication token")
	ErrSigningKey   = errors.New("signing key configuration missing")
)

type Claims struct {
	UserID string   \`json:"user_id"\`
	Email  string   \`json:"email"\`
	Roles  []string \`json:"roles"\`
	jwt.RegisteredClaims
}

// GenerateToken creates a signed JWT token with standard claims and 24h TTL
func GenerateToken(userID, email string, roles []string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", ErrSigningKey
	}

	claims := Claims{
		UserID: userID,
		Email:  email,
		Roles:  roles,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "termai-core-auth",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// ValidateToken verifies token signature and extracts claims
// [TARGET SYMBOL FOR @workspace QUERY: "di mana fungsi autentikasi token didefinisikan?"]
func ValidateToken(tokenStr string) (*Claims, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return nil, ErrSigningKey
	}

	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(secret), nil
	})

	if err != nil || !token.Valid {
		return nil, ErrInvalidToken
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, ErrInvalidToken
	}

	return claims, nil
}
`,
  },
  {
    path: "src/middleware/auth.go",
    name: "auth.go",
    language: "go",
    sizeBytes: 1420,
    astNodesCount: 8,
    content: `package middleware

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"termai/src/auth"
)

// JWTAuthMiddleware enforces bearer token validation on incoming HTTP requests
func JWTAuthMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return c.JSON(http.StatusUnauthorized, echo.Map{
					"error": "Authorization header required",
				})
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				return c.JSON(http.StatusUnauthorized, echo.Map{
					"error": "Invalid token format. Expected: Bearer <token>",
				})
			}

			claims, err := auth.ValidateToken(parts[1])
			if err != nil {
				return c.JSON(http.StatusUnauthorized, echo.Map{
					"error": err.Error(),
				})
			}

			c.Set("user_claims", claims)
			c.Set("user_id", claims.UserID)

			return next(c)
		}
	}
}
`,
  },
  {
    path: "src/api/router.go",
    name: "router.go",
    language: "go",
    sizeBytes: 1100,
    astNodesCount: 9,
    content: `package api

import (
	"github.com/labstack/echo/v4"
	"termai/src/handlers"
	"termai/src/middleware"
)

func RegisterRoutes(e *echo.Echo) {
	api := e.Group("/api/v1")

	// Public authentication endpoints
	authGroup := api.Group("/auth")
	authGroup.POST("/login", handlers.LoginHandler)
	authGroup.POST("/register", handlers.RegisterHandler)

	// Protected workspace analysis endpoints
	workspace := api.Group("/workspace", middleware.JWTAuthMiddleware())
	workspace.GET("/ast/tree", handlers.GetAstTreeHandler)
	workspace.POST("/query", handlers.QueryWorkspaceHandler)
	workspace.POST("/refactor", handlers.InlineRefactorHandler)
}
`,
  },
  {
    path: "src/models/user.go",
    name: "user.go",
    language: "go",
    sizeBytes: 890,
    astNodesCount: 6,
    content: `package models

import (
	"time"
)

type Role string

const (
	RoleAdmin     Role = "admin"
	RoleDeveloper Role = "developer"
	RoleViewer    Role = "viewer"
)

type User struct {
	ID           string    \`json:"id"\`
	Email        string    \`json:"email"\`
	PasswordHash string    \`json:"-"\`
	Role         Role      \`json:"role"\`
	CreatedAt    time.Time \`json:"created_at"\`
	UpdatedAt    time.Time \`json:"updated_at"\`
}

func (u *User) HasAdminPrivileges() bool {
	return u.Role == RoleAdmin
}
`,
  },
  {
    path: "src/core/ast_engine.rs",
    name: "ast_engine.rs",
    language: "rust",
    sizeBytes: 2150,
    astNodesCount: 16,
    content: `use tree_sitter::{Parser, Query, QueryCursor};
use std::collections::HashMap;

/// TermAI-Core AST Engine compiled in Rust
/// Zero-cost abstraction for blazing-fast code structure extraction
pub struct TreeSitterAstEngine {
    parser: Parser,
    language_queries: HashMap<String, Query>,
}

impl TreeSitterAstEngine {
    pub fn new() -> Self {
        let mut parser = Parser::new();
        // High efficiency parser setup - 0 GC overhead
        Self {
            parser,
            language_queries: HashMap::with_capacity(8),
        }
    }

    pub fn parse_symbols(&mut self, source_code: &str) -> Result<Vec<String>, String> {
        let tree = self.parser.parse(source_code, None)
            .ok_or_else(|| "Failed to construct AST".to_string())?;
        
        let root_node = tree.root_node();
        let mut symbols = Vec::new();
        
        // Walk syntax tree without loading full file tokens into RAM
        let mut cursor = root_node.walk();
        for child in root_node.children(&mut cursor) {
            if child.kind() == "function_declaration" || child.kind() == "type_declaration" {
                symbols.push(child.kind().to_string());
            }
        }
        
        Ok(symbols)
    }
}
`,
  },
  {
    path: "termai.toml",
    name: "termai.toml",
    language: "yaml",
    sizeBytes: 420,
    astNodesCount: 3,
    content: `# TermAI-Core Zero-Config Configuration
[project]
name = "TermAI-Core"
version = "0.4.2"
backend = "rust"         # options: "rust", "go"
tui = "ratatui"          # options: "ratatui", "bubbletea"

[rag]
vector_store = "lancedb" # options: "lancedb", "duckdb"
embedding_model = "local-bge-small"
max_ram_mb = 16

[llm]
provider = "gemini"      # options: "gemini", "ollama"
default_model = "gemini-3.8-flash"
fallback_model = "qwen2.5-coder:7b"
`,
  },
];

export const FILE_AST_MAP: Record<string, AstNode[]> = {
  "src/auth/jwt_service.go": [
    {
      id: "pkg-1",
      type: "package_clause",
      name: "package auth",
      startLine: 1,
      endLine: 1,
    },
    {
      id: "import-1",
      type: "import_declaration",
      name: "import (errors, fmt, os, time, jwt)",
      startLine: 3,
      endLine: 11,
    },
    {
      id: "type-1",
      type: "type_declaration (struct)",
      name: "type Claims struct",
      startLine: 18,
      endLine: 23,
      detail: "UserID, Email, Roles, RegisteredClaims",
    },
    {
      id: "func-1",
      type: "function_declaration",
      name: "GenerateToken(userID, email string, roles []string) (string, error)",
      startLine: 26,
      endLine: 45,
      detail: "Creates signed JWT with 24h expiration",
    },
    {
      id: "func-2",
      type: "function_declaration",
      name: "ValidateToken(tokenStr string) (*Claims, error)",
      startLine: 48,
      endLine: 72,
      detail: "Token signature validation & claims extraction",
    },
  ],
  "src/middleware/auth.go": [
    {
      id: "mw-pkg",
      type: "package_clause",
      name: "package middleware",
      startLine: 1,
      endLine: 1,
    },
    {
      id: "mw-func",
      type: "function_declaration",
      name: "JWTAuthMiddleware() echo.MiddlewareFunc",
      startLine: 12,
      endLine: 42,
      detail: "Bearer token extraction and auth.ValidateToken call",
    },
  ],
  "src/api/router.go": [
    {
      id: "rt-pkg",
      type: "package_clause",
      name: "package api",
      startLine: 1,
      endLine: 1,
    },
    {
      id: "rt-func",
      type: "function_declaration",
      name: "RegisterRoutes(e *echo.Echo)",
      startLine: 9,
      endLine: 23,
      detail: "Registers /auth and /workspace route groups",
    },
  ],
  "src/models/user.go": [
    {
      id: "usr-type-1",
      type: "type_declaration (struct)",
      name: "type User struct",
      startLine: 15,
      endLine: 22,
    },
    {
      id: "usr-meth-1",
      type: "method_declaration",
      name: "(u *User) HasAdminPrivileges() bool",
      startLine: 24,
      endLine: 26,
    },
  ],
  "src/core/ast_engine.rs": [
    {
      id: "rs-struct",
      type: "struct_definition",
      name: "pub struct TreeSitterAstEngine",
      startLine: 6,
      endLine: 9,
    },
    {
      id: "rs-impl",
      type: "impl_block",
      name: "impl TreeSitterAstEngine",
      startLine: 11,
      endLine: 35,
      children: [
        {
          id: "rs-fn-1",
          type: "function_declaration",
          name: "pub fn new() -> Self",
          startLine: 12,
          endLine: 18,
        },
        {
          id: "rs-fn-2",
          type: "function_declaration",
          name: "pub fn parse_symbols(&mut self, source_code: &str)",
          startLine: 20,
          endLine: 34,
        },
      ],
    },
  ],
};
