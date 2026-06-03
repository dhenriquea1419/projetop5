// src/services/mercadopago.ts
// Serviço de integração com Mercado Pago para React Native / Expo

// --- Interfaces ---
interface PaymentMethod {
  id: string;
  label: string;
  type: 'credit' | 'debit' | 'pix' | 'boleto' | 'wallet';
  maxInstallments: number;
  discountPercent: number;
}

// --- Constantes (substitua pelos valores reais) ---
const ACCESS_TOKEN = 'TEST-3025437541684982-052623-2ed0efcbdec6462c96e9b9e5718d8e56-661828513'; // Token de acesso do Mercado Pago
const PUBLIC_KEY = 'TEST-b3eeb5e1-d01c-49ee-961d-07446fcce1bc'; // Chave pública (usada no frontend, se necessário)

// --- Lista completa de meios de pagamento ---
const paymentMethods: PaymentMethod[] = [
  { id: 'visa', label: 'Visa', type: 'credit', maxInstallments: 12, discountPercent: 0 },
  { id: 'mastercard', label: 'Mastercard', type: 'credit', maxInstallments: 12, discountPercent: 0 },
  { id: 'elo', label: 'Elo', type: 'credit', maxInstallments: 12, discountPercent: 0 },
  { id: 'hipercard', label: 'Hipercard', type: 'credit', maxInstallments: 12, discountPercent: 0 },
  { id: 'amex', label: 'Amex', type: 'credit', maxInstallments: 12, discountPercent: 0 },
  { id: 'diners', label: 'Diners', type: 'credit', maxInstallments: 12, discountPercent: 0 },
  { id: 'debito_visa', label: 'Débito Visa', type: 'debit', maxInstallments: 1, discountPercent: 0 },
  { id: 'debito_mastercard', label: 'Débito Mastercard', type: 'debit', maxInstallments: 1, discountPercent: 0 },
  { id: 'pix', label: 'PIX', type: 'pix', maxInstallments: 1, discountPercent: 0 },
  { id: 'boleto', label: 'Boleto', type: 'boleto', maxInstallments: 1, discountPercent: 0 },
  { id: 'carteira_mp', label: 'Carteira Mercado Pago', type: 'wallet', maxInstallments: 12, discountPercent: 0 },
];

/**
 * Gera um pagamento via PIX.
 * @param totalValue - Valor total em centavos (ex: 1990 para R$19,90)
 * @param description - Descrição do pagamento
 * @param customerName - Nome do cliente
 * @param customerEmail - Email do cliente
 * @returns Objeto com qrCodeBase64, qrCodeText e paymentId
 */
export async function generatePixPayment(
  totalValue: number,
  description: string,
  customerName: string,
  customerEmail: string
): Promise<{ qrCodeBase64: string; qrCodeText: string; paymentId: string }> {
  const url = 'https://api.mercadopago.com/v1/payments';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };

  // Monta o body da requisição conforme documentação do Mercado Pago
  const body = {
    transaction_amount: totalValue / 100, // valor em reais
    description: description,
    payment_method_id: 'pix',
    payer: {
      email: customerEmail,
      first_name: customerName.split(' ')[0],
      last_name: customerName.split(' ').slice(1).join(' ') || 'Cliente',
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar pagamento PIX: ${response.status}`);
    }

    const data = await response.json();

    // Extrai os dados do ponto de pagamento PIX
    const pointOfInteraction = data.point_of_interaction?.transaction_data;
    if (!pointOfInteraction) {
      throw new Error('Dados do PIX não encontrados na resposta');
    }

    return {
      qrCodeBase64: pointOfInteraction.qr_code_base64,
      qrCodeText: pointOfInteraction.qr_code,
      paymentId: data.id.toString(),
    };
  } catch (error) {
    console.error('Erro em generatePixPayment:', error);
    throw error;
  }
}

/**
 * Gera um link de checkout (preferência) para pagamento via Mercado Pago.
 * @param totalValue - Valor total em centavos
 * @param description - Descrição
 * @param items - Array de itens (cada um com title, quantity, unit_price)
 * @param customerEmail - Email do cliente
 * @returns Objeto com checkoutUrl e preferenceId
 */
export async function generateCheckoutLink(
  totalValue: number,
  description: string,
  items: { title: string; quantity: number; unit_price: number }[],
  customerEmail: string
): Promise<{ checkoutUrl: string; preferenceId: string }> {
  const url = 'https://api.mercadopago.com/checkout/preferences';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };

  // Converte items para o formato do Mercado Pago (unit_price em reais)
  const mappedItems = items.map(item => ({
    title: item.title,
    quantity: item.quantity,
    unit_price: item.unit_price / 100,
  }));

  const body = {
    items: mappedItems,
    payer: {
      email: customerEmail,
    },
    back_urls: {
      success: 'https://seusite.com/sucesso',
      failure: 'https://seusite.com/erro',
      pending: 'https://seusite.com/pendente',
    },
    auto_return: 'approved',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar preferência: ${response.status}`);
    }

    const data = await response.json();

    return {
      checkoutUrl: data.init_point,
      preferenceId: data.id,
    };
  } catch (error) {
    console.error('Erro em generateCheckoutLink:', error);
    throw error;
  }
}

/**
 * Consulta o status de um pagamento pelo ID.
 * @param paymentId - ID do pagamento
 * @returns Status do pagamento (ex: 'approved', 'pending', 'rejected')
 */
export async function getPaymentStatus(paymentId: string): Promise<{ status: string }> {
  const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;
  const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Erro ao consultar pagamento: ${response.status}`);
    }

    const data = await response.json();

    return { status: data.status };
  } catch (error) {
    console.error('Erro em getPaymentStatus:', error);
    throw error;
  }
}

/**
 * Obtém as opções de parcelamento para um método de pagamento.
 * @param methodId - ID do método (ex: 'visa')
 * @param totalValue - Valor total em centavos
 * @returns Lista de opções de parcelamento (simplificado - retorna dados mockados para demonstração)
 */
export async function getInstallmentsOptions(methodId: string, totalValue: number): Promise<any[]> {
  // Em produção, consulte o endpoint de parcelas do Mercado Pago
  // https://api.mercadopago.com/v1/payment_methods/installments?payment_method_id=...&amount=...
  console.warn('getInstallmentsOptions: implementação mockada');
  return [
    { installment: 1, total: totalValue, monthly: totalValue },
    { installment: 2, total: totalValue, monthly: totalValue / 2 },
    { installment: 3, total: totalValue, monthly: totalValue / 3 },
  ];
}

/**
 * Formata um valor em centavos para moeda brasileira (R$).
 * @param value - Valor em centavos
 * @returns String formatada (ex: 'R$ 19,90')
 */
export function formatCurrency(value: number): string {
  const realValue = value / 100;
  return realValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// Exporta a lista de métodos de pagamento para uso externo
export { paymentMethods };
