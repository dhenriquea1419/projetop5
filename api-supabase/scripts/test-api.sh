#!/bin/bash

# Script de teste da API Supabase
# Use este script para testar todos os endpoints

BASE_URL="http://localhost:3000/api"
TOKEN=""
CATEGORY_ID=""
PRODUCT_ID=""
CLIENT_ID=""
ORDER_ID=""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Teste da API Supabase ===${NC}\n"

# 1. Health Check
echo -e "${YELLOW}[1/10] Health Check...${NC}"
curl -s "$BASE_URL/../health" | jq .
echo ""

# 2. Signup
echo -e "${YELLOW}[2/10] Criar usuário (Signup)...${NC}"
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@farmacia.com",
    "password": "senha123",
    "name": "João Teste",
    "role": "vendedor"
  }')

echo $SIGNUP_RESPONSE | jq .
echo ""

# 3. Login
echo -e "${YELLOW}[3/10] Fazer login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@farmacia.com",
    "password": "senha123"
  }')

echo $LOGIN_RESPONSE | jq .
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo -e "${GREEN}Token: $TOKEN${NC}\n"

# 4. Get Current User
echo -e "${YELLOW}[4/10] Obter usuário atual...${NC}"
curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# 5. Create Category
echo -e "${YELLOW}[5/10] Criar categoria...${NC}"
CATEGORY_RESPONSE=$(curl -s -X POST "$BASE_URL/categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Antibióticos",
    "description": "Medicamentos antibióticos"
  }')

echo $CATEGORY_RESPONSE | jq .
CATEGORY_ID=$(echo $CATEGORY_RESPONSE | jq -r '.id')
echo ""

# 6. List Categories
echo -e "${YELLOW}[6/10] Listar categorias...${NC}"
curl -s -X GET "$BASE_URL/categories" | jq .
echo ""

# 7. Create Product
echo -e "${YELLOW}[7/10] Criar produto...${NC}"
PRODUCT_RESPONSE=$(curl -s -X POST "$BASE_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"Dipirona 500mg\",
    \"description\": \"Comprimido 500mg\",
    \"price\": 5.50,
    \"stock\": 100,
    \"category_id\": \"$CATEGORY_ID\",
    \"barcode\": \"1234567890\"
  }")

echo $PRODUCT_RESPONSE | jq .
PRODUCT_ID=$(echo $PRODUCT_RESPONSE | jq -r '.id')
echo ""

# 8. Create Client
echo -e "${YELLOW}[8/10] Criar cliente...${NC}"
CLIENT_RESPONSE=$(curl -s -X POST "$BASE_URL/clients" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@email.com",
    "phone": "(11) 99999-8888",
    "cpf": "123.456.789-00",
    "address": "Rua das Flores, 123",
    "city": "São Paulo",
    "state": "SP",
    "zipcode": "01234-567"
  }')

echo $CLIENT_RESPONSE | jq .
CLIENT_ID=$(echo $CLIENT_RESPONSE | jq -r '.id')
echo ""

# 9. Create Order
echo -e "${YELLOW}[9/10] Criar pedido...${NC}"
ORDER_RESPONSE=$(curl -s -X POST "$BASE_URL/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"client_id\": \"$CLIENT_ID\",
    \"items\": [
      {
        \"product_id\": \"$PRODUCT_ID\",
        \"quantity\": 2,
        \"unit_price\": 5.50
      }
    ],
    \"notes\": \"Entrega rápida\"
  }")

echo $ORDER_RESPONSE | jq .
ORDER_ID=$(echo $ORDER_RESPONSE | jq -r '.id')
echo ""

# 10. Get Reports
echo -e "${YELLOW}[10/10] Obter relatório de vendas...${NC}"
curl -s -X GET "$BASE_URL/reports/sales" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

echo -e "${GREEN}=== Testes concluídos ===${NC}"
