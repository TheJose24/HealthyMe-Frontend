export interface IOllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: IOllamaOptions;
  system?: string;
  keep_alive?: string;
  format?: string;
}

export interface IOllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface IOllamaOptions {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  repeat_penalty?: number;
  seed?: number;
  num_predict?: number;
  stop?: string[];
  num_ctx?: number;
  num_batch?: number;
  num_gqa?: number;
  num_gpu?: number;
  main_gpu?: number;
  low_vram?: boolean;
  f16_kv?: boolean;
  logits_all?: boolean;
  vocab_only?: boolean;
  use_mmap?: boolean;
  use_mlock?: boolean;
  num_thread?: number;
}

export interface IOllamaConfig {
  baseUrl: string;
  model: string;
  timeout: number;
  maxRetries: number;
  systemPrompt: string;
  keepAlive?: string;
  maxTokens?: number;
}

export interface IOllamaError {
  code: string;
  message: string;
  details?: any;
}
