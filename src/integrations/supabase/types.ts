export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          project_id: string | null
          team_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          project_id?: string | null
          team_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          project_id?: string | null
          team_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_resolved: boolean
          message: string
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_resolved?: boolean
          message: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_resolved?: boolean
          message?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
        }
        Relationships: []
      }
      ai_config: {
        Row: {
          created_at: string
          id: string
          max_tokens: number | null
          model_id: string
          rate_limit: number | null
          temperature: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_tokens?: number | null
          model_id: string
          rate_limit?: number | null
          temperature?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          max_tokens?: number | null
          model_id?: string
          rate_limit?: number | null
          temperature?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_logs: {
        Row: {
          created_at: string
          duration_ms: number
          id: string
          model_id: string
          project_id: string | null
          prompt: string
          response: string | null
          tokens_used: number
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number
          id?: string
          model_id: string
          project_id?: string | null
          prompt: string
          response?: string | null
          tokens_used?: number
          user_id: string
        }
        Update: {
          created_at?: string
          duration_ms?: number
          id?: string
          model_id?: string
          project_id?: string | null
          prompt?: string
          response?: string | null
          tokens_used?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage: {
        Row: {
          created_at: string
          id: string
          model_id: string
          project_id: string | null
          request_cost: number
          tokens_used: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          model_id: string
          project_id?: string | null
          request_cost?: number
          tokens_used: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          model_id?: string
          project_id?: string | null
          request_cost?: number
          tokens_used?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      api_access: {
        Row: {
          api_key_id: string
          created_at: string
          id: string
          permission: string
          resource_type: string
        }
        Insert: {
          api_key_id: string
          created_at?: string
          id?: string
          permission: string
          resource_type: string
        }
        Update: {
          api_key_id?: string
          created_at?: string
          id?: string
          permission?: string
          resource_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_access_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key_hash: string
          key_name: string
          key_prefix: string
          last_used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash: string
          key_name: string
          key_prefix: string
          last_used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash?: string
          key_name?: string
          key_prefix?: string
          last_used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      api_requests: {
        Row: {
          api_key_id: string
          created_at: string
          duration_ms: number
          endpoint: string
          id: string
          ip_address: string | null
          method: string
          status_code: number
        }
        Insert: {
          api_key_id: string
          created_at?: string
          duration_ms?: number
          endpoint: string
          id?: string
          ip_address?: string | null
          method: string
          status_code: number
        }
        Update: {
          api_key_id?: string
          created_at?: string
          duration_ms?: number
          endpoint?: string
          id?: string
          ip_address?: string | null
          method?: string
          status_code?: number
        }
        Relationships: [
          {
            foreignKeyName: "api_requests_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_accounts: {
        Row: {
          billing_email: string
          created_at: string
          id: string
          payment_method_id: string | null
          stripe_customer_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_email: string
          created_at?: string
          id?: string
          payment_method_id?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_email?: string
          created_at?: string
          id?: string
          payment_method_id?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      billing_invoices: {
        Row: {
          amount: number
          billing_account_id: string
          created_at: string
          due_date: string
          id: string
          invoice_number: string
          invoice_url: string | null
          paid_at: string | null
          status: string
        }
        Insert: {
          amount: number
          billing_account_id: string
          created_at?: string
          due_date: string
          id?: string
          invoice_number: string
          invoice_url?: string | null
          paid_at?: string | null
          status?: string
        }
        Update: {
          amount?: number
          billing_account_id?: string
          created_at?: string
          due_date?: string
          id?: string
          invoice_number?: string
          invoice_url?: string | null
          paid_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_invoices_billing_account_id_fkey"
            columns: ["billing_account_id"]
            isOneToOne: false
            referencedRelation: "billing_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_plans: {
        Row: {
          created_at: string
          features: Json | null
          id: string
          is_active: boolean
          limits: Json | null
          plan_name: string
          price_monthly: number
          price_yearly: number
        }
        Insert: {
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean
          limits?: Json | null
          plan_name: string
          price_monthly: number
          price_yearly: number
        }
        Update: {
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean
          limits?: Json | null
          plan_name?: string
          price_monthly?: number
          price_yearly?: number
        }
        Relationships: []
      }
      billing_usage: {
        Row: {
          billing_period_end: string
          billing_period_start: string
          created_at: string
          id: string
          quantity: number
          total_cost: number
          unit_cost: number
          usage_type: string
          user_id: string
        }
        Insert: {
          billing_period_end: string
          billing_period_start: string
          created_at?: string
          id?: string
          quantity?: number
          total_cost?: number
          unit_cost?: number
          usage_type: string
          user_id: string
        }
        Update: {
          billing_period_end?: string
          billing_period_start?: string
          created_at?: string
          id?: string
          quantity?: number
          total_cost?: number
          unit_cost?: number
          usage_type?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          granted_by: string | null
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          granted_by?: string | null
          id?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          granted_by?: string | null
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      deleted_user_blacklist: {
        Row: {
          deleted_at: string
          deleted_by: string | null
          deletion_reason: string
          email: string
          full_name: string | null
          id: string
          original_user_id: string | null
        }
        Insert: {
          deleted_at?: string
          deleted_by?: string | null
          deletion_reason: string
          email: string
          full_name?: string | null
          id?: string
          original_user_id?: string | null
        }
        Update: {
          deleted_at?: string
          deleted_by?: string | null
          deletion_reason?: string
          email?: string
          full_name?: string | null
          id?: string
          original_user_id?: string | null
        }
        Relationships: []
      }
      edge_errors: {
        Row: {
          created_at: string
          error_message: string
          function_id: string
          id: string
          stack_trace: string | null
        }
        Insert: {
          created_at?: string
          error_message: string
          function_id: string
          id?: string
          stack_trace?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string
          function_id?: string
          id?: string
          stack_trace?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "edge_errors_function_id_fkey"
            columns: ["function_id"]
            isOneToOne: false
            referencedRelation: "edge_functions"
            referencedColumns: ["id"]
          },
        ]
      }
      edge_functions: {
        Row: {
          created_at: string
          function_name: string
          function_path: string
          id: string
          is_active: boolean
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          function_name: string
          function_path: string
          id?: string
          is_active?: boolean
          project_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          function_name?: string
          function_path?: string
          id?: string
          is_active?: boolean
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edge_functions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      edge_logs: {
        Row: {
          created_at: string
          duration_ms: number
          function_id: string
          id: string
          request_body: Json | null
          response_body: Json | null
          status_code: number
        }
        Insert: {
          created_at?: string
          duration_ms?: number
          function_id: string
          id?: string
          request_body?: Json | null
          response_body?: Json | null
          status_code: number
        }
        Update: {
          created_at?: string
          duration_ms?: number
          function_id?: string
          id?: string
          request_body?: Json | null
          response_body?: Json | null
          status_code?: number
        }
        Relationships: [
          {
            foreignKeyName: "edge_logs_function_id_fkey"
            columns: ["function_id"]
            isOneToOne: false
            referencedRelation: "edge_functions"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_enabled: boolean
          metadata: Json | null
          name: string
          rollout_percentage: number
          target_plans: string[] | null
          target_teams: string[] | null
          target_users: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean
          metadata?: Json | null
          name: string
          rollout_percentage?: number
          target_plans?: string[] | null
          target_teams?: string[] | null
          target_users?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean
          metadata?: Json | null
          name?: string
          rollout_percentage?: number
          target_plans?: string[] | null
          target_teams?: string[] | null
          target_users?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          assigned_to: string | null
          attachments: string[] | null
          created_at: string
          id: string
          message: string
          metadata: Json | null
          priority: string
          project_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          subject: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          attachments?: string[] | null
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          priority?: string
          project_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          subject: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          attachments?: string[] | null
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string
          project_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          subject?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      github_connections: {
        Row: {
          connected_at: string
          github_token: string
          github_username: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connected_at?: string
          github_token: string
          github_username: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connected_at?: string
          github_token?: string
          github_username?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      integrations_stripe: {
        Row: {
          connected_at: string
          id: string
          is_active: boolean
          stripe_publishable_key: string
          stripe_secret_key: string
          user_id: string
          webhook_secret: string | null
        }
        Insert: {
          connected_at?: string
          id?: string
          is_active?: boolean
          stripe_publishable_key: string
          stripe_secret_key: string
          user_id: string
          webhook_secret?: string | null
        }
        Update: {
          connected_at?: string
          id?: string
          is_active?: boolean
          stripe_publishable_key?: string
          stripe_secret_key?: string
          user_id?: string
          webhook_secret?: string | null
        }
        Relationships: []
      }
      integrations_supabase: {
        Row: {
          connected_at: string
          id: string
          is_active: boolean
          project_id: string
          supabase_anon_key: string
          supabase_url: string
          user_id: string
        }
        Insert: {
          connected_at?: string
          id?: string
          is_active?: boolean
          project_id: string
          supabase_anon_key: string
          supabase_url: string
          user_id: string
        }
        Update: {
          connected_at?: string
          id?: string
          is_active?: boolean
          project_id?: string
          supabase_anon_key?: string
          supabase_url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_supabase_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      llm_logs: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          prompt: string
          response: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          prompt: string
          response?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          prompt?: string
          response?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          billing_alerts: boolean
          email_enabled: boolean
          id: string
          project_updates: boolean
          push_enabled: boolean
          security_alerts: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_alerts?: boolean
          email_enabled?: boolean
          id?: string
          project_updates?: boolean
          push_enabled?: boolean
          security_alerts?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_alerts?: boolean
          email_enabled?: boolean
          id?: string
          project_updates?: boolean
          push_enabled?: boolean
          security_alerts?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_errors: {
        Row: {
          created_at: string
          error_code: string | null
          error_message: string
          id: string
          project_id: string | null
          stack_trace: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_code?: string | null
          error_message: string
          id?: string
          project_id?: string | null
          stack_trace?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_code?: string | null
          error_message?: string
          id?: string
          project_id?: string | null
          stack_trace?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_errors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_limits: {
        Row: {
          description: string | null
          id: string
          limit_type: string
          limit_value: number
          updated_at: string
        }
        Insert: {
          description?: string | null
          id?: string
          limit_type: string
          limit_value: number
          updated_at?: string
        }
        Update: {
          description?: string | null
          id?: string
          limit_type?: string
          limit_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      platform_logs: {
        Row: {
          created_at: string
          id: string
          level: string
          message: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          level?: string
          message: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          message?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      project_deployments: {
        Row: {
          build_log: string | null
          created_at: string
          deployed_at: string | null
          deployment_url: string | null
          id: string
          project_id: string
          status: string
        }
        Insert: {
          build_log?: string | null
          created_at?: string
          deployed_at?: string | null
          deployment_url?: string | null
          id?: string
          project_id: string
          status?: string
        }
        Update: {
          build_log?: string | null
          created_at?: string
          deployed_at?: string | null
          deployment_url?: string | null
          id?: string
          project_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_deployments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_env_vars: {
        Row: {
          created_at: string
          id: string
          is_secret: boolean
          key: string
          project_id: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_secret?: boolean
          key: string
          project_id: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          is_secret?: boolean
          key?: string
          project_id?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_env_vars_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_files: {
        Row: {
          created_at: string
          file_content: string
          file_path: string
          file_type: string | null
          id: string
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_content: string
          file_path: string
          file_type?: string | null
          id?: string
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_content?: string
          file_path?: string
          file_type?: string | null
          id?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          project_id: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_metadata: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          project_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          project_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          project_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_snapshots: {
        Row: {
          created_at: string
          id: string
          project_id: string
          snapshot_data: Json
          snapshot_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          snapshot_data?: Json
          snapshot_name: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          snapshot_data?: Json
          snapshot_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          github_repo_url: string | null
          id: string
          is_archived: boolean
          name: string
          paired_project_id: string | null
          updated_at: string
          user_id: string
          variant_type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          github_repo_url?: string | null
          id?: string
          is_archived?: boolean
          name: string
          paired_project_id?: string | null
          updated_at?: string
          user_id: string
          variant_type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          github_repo_url?: string | null
          id?: string
          is_archived?: boolean
          name?: string
          paired_project_id?: string | null
          updated_at?: string
          user_id?: string
          variant_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_paired_project_id_fkey"
            columns: ["paired_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit: {
        Row: {
          action: string
          changes: Json | null
          created_at: string
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_id: string
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_id: string
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_id?: string
        }
        Relationships: []
      }
      security_blocks: {
        Row: {
          block_type: string
          created_at: string
          expires_at: string | null
          id: string
          ip_address: string | null
          reason: string
          user_id: string | null
        }
        Insert: {
          block_type: string
          created_at?: string
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          reason: string
          user_id?: string | null
        }
        Update: {
          block_type?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          reason?: string
          user_id?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      storage_buckets: {
        Row: {
          allowed_mime_types: string[] | null
          created_at: string
          file_size_limit: number | null
          id: string
          name: string
          owner_id: string
          public: boolean
          updated_at: string
        }
        Insert: {
          allowed_mime_types?: string[] | null
          created_at?: string
          file_size_limit?: number | null
          id?: string
          name: string
          owner_id: string
          public?: boolean
          updated_at?: string
        }
        Update: {
          allowed_mime_types?: string[] | null
          created_at?: string
          file_size_limit?: number | null
          id?: string
          name?: string
          owner_id?: string
          public?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      storage_objects: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          metadata: Json | null
          mime_type: string | null
          name: string
          owner_id: string
          path: string
          size: number
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          name: string
          owner_id: string
          path: string
          size: number
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          name?: string
          owner_id?: string
          path?: string
          size?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "storage_objects_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "storage_buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_permissions: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          permission: string
          user_id: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id?: string
          permission: string
          user_id: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          permission?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "storage_permissions_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "storage_buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_usage: {
        Row: {
          bytes_used: number
          calculated_at: string
          file_count: number
          id: string
          project_id: string | null
          user_id: string
        }
        Insert: {
          bytes_used?: number
          calculated_at?: string
          file_count?: number
          id?: string
          project_id?: string | null
          user_id: string
        }
        Update: {
          bytes_used?: number
          calculated_at?: string
          file_count?: number
          id?: string
          project_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "storage_usage_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          invite_status: string
          invited_by: string | null
          invited_email: string | null
          joined_at: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invite_status?: string
          invited_by?: string | null
          invited_email?: string | null
          joined_at?: string
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invite_status?: string
          invited_by?: string | null
          invited_email?: string | null
          joined_at?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_notes: {
        Row: {
          color: string | null
          content: string | null
          created_at: string
          id: string
          is_pinned: boolean | null
          team_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          team_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          team_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_notes_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          avatar_url: string | null
          created_at: string
          description: string | null
          id: string
          is_personal: boolean
          name: string
          owner_id: string
          settings: Json | null
          slug: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_personal?: boolean
          name: string
          owner_id: string
          settings?: Json | null
          slug?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_personal?: boolean
          name?: string
          owner_id?: string
          settings?: Json | null
          slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_featured: boolean
          is_public: boolean
          name: string
          preview_url: string | null
          tags: string[] | null
          template_data: Json
          thumbnail_url: string | null
          updated_at: string
          use_count: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean
          is_public?: boolean
          name: string
          preview_url?: string | null
          tags?: string[] | null
          template_data?: Json
          thumbnail_url?: string | null
          updated_at?: string
          use_count?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean
          is_public?: boolean
          name?: string
          preview_url?: string | null
          tags?: string[] | null
          template_data?: Json
          thumbnail_url?: string | null
          updated_at?: string
          use_count?: number
        }
        Relationships: []
      }
      user_connections: {
        Row: {
          access_token: string | null
          connected_at: string
          expires_at: string | null
          id: string
          provider: string
          provider_user_id: string
          refresh_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          connected_at?: string
          expires_at?: string | null
          id?: string
          provider: string
          provider_user_id: string
          refresh_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          connected_at?: string
          expires_at?: string | null
          id?: string
          provider?: string
          provider_user_id?: string
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          balance: number
          created_at: string
          id: string
          total_earned: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          billing_cycle: string
          cancel_at_period_end: boolean
          cancelled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string
          id: string
          plan_id: string | null
          status: string
          stripe_subscription_id: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle?: string
          cancel_at_period_end?: boolean
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string
          id?: string
          plan_id?: string | null
          status?: string
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle?: string
          cancel_at_period_end?: boolean
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string
          id?: string
          plan_id?: string | null
          status?: string
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "billing_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string
          events: string[]
          failure_count: number
          headers: Json | null
          id: string
          is_active: boolean
          last_status_code: number | null
          last_triggered_at: string | null
          name: string
          project_id: string | null
          secret: string | null
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          events?: string[]
          failure_count?: number
          headers?: Json | null
          id?: string
          is_active?: boolean
          last_status_code?: number | null
          last_triggered_at?: string | null
          name: string
          project_id?: string | null
          secret?: string | null
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          events?: string[]
          failure_count?: number
          headers?: Json | null
          id?: string
          is_active?: boolean
          last_status_code?: number | null
          last_triggered_at?: string | null
          name?: string
          project_id?: string | null
          secret?: string | null
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "owner" | "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "admin", "moderator", "user"],
    },
  },
} as const
