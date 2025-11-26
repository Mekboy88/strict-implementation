-- Create notes table for team collaboration
CREATE TABLE public.team_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  user_id UUID NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  is_pinned BOOLEAN DEFAULT false,
  color TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for team notes
CREATE POLICY "Users can view their own notes"
ON public.team_notes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view team notes"
ON public.team_notes
FOR SELECT
USING (
  team_id IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create notes"
ON public.team_notes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
ON public.team_notes
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
ON public.team_notes
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_team_notes_updated_at
BEFORE UPDATE ON public.team_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();