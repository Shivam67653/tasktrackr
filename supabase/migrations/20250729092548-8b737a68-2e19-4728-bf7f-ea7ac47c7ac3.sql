-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  jojo_characters JSONB := '[
    {"emoji": "⭐", "name": "Jotaro Kujo", "stand": "Star Platinum", "imageUrl": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=face"},
    {"emoji": "🌍", "name": "DIO", "stand": "The World", "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"},
    {"emoji": "🌟", "name": "Giorno Giovanna", "stand": "Gold Experience", "imageUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"},
    {"emoji": "💜", "name": "Josuke Higashikata", "stand": "Crazy Diamond", "imageUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"},
    {"emoji": "🔥", "name": "Joseph Joestar", "stand": "Hermit Purple", "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face"},
    {"emoji": "⚡", "name": "Jonathan Joestar", "stand": "Hamon Energy", "imageUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face"},
    {"emoji": "🌊", "name": "Jolyne Cujoh", "stand": "Stone Free", "imageUrl": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"},
    {"emoji": "🎭", "name": "Johnny Joestar", "stand": "Tusk Act 4", "imageUrl": "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face"}
  ]'::JSONB;
  random_character JSONB;
  default_board_id UUID;
BEGIN
  -- Select random JoJo character
  random_character := jojo_characters->((random() * (jsonb_array_length(jojo_characters) - 1))::int);
  
  -- Insert profile
  INSERT INTO public.profiles (id, username, avatar_emoji, stand_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    random_character->>'emoji',
    random_character->>'stand',
    random_character->>'imageUrl'
  );
  
  -- Create default board
  INSERT INTO public.boards (user_id, name, description)
  VALUES (NEW.id, 'My Tasks', 'Default task board')
  RETURNING id INTO default_board_id;
  
  RETURN NEW;
END;
$$;