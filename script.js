let fastingTimer;
        let fastingStartTime;
        let fastingDuration = 16 * 60 * 60; // 16 hours in seconds

        function calculateDiet() {
            // Get form values
            const name = document.getElementById('name').value || 'Friend';
            const age = parseInt(document.getElementById('age').value);
            const gender = document.getElementById('gender').value;
            const height = parseInt(document.getElementById('height').value);
            const weight = parseInt(document.getElementById('weight').value);
            const activity = parseFloat(document.getElementById('activity').value);
            const goal = document.getElementById('goal').value;
            const diet = document.getElementById('diet').value;

            // Validate inputs
            if (!age || !gender || !height || !weight || !activity || !goal || !diet) {
                alert('Please fill in all required fields!');
                return;
            }

            // Calculate BMR using Mifflin-St Jeor Equation
            let bmr;
            if (gender === 'male') {
                bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            } else {
                bmr = 10 * weight + 6.25 * height - 5 * age - 161;
            }

            // Calculate TDEE
            let tdee = bmr * activity;

            // Adjust calories based on goal
            let calories;
            switch (goal) {
                case 'lose':
                    calories = Math.round(tdee - 500); // 500 cal deficit
                    break;
                case 'maintain':
                    calories = Math.round(tdee);
                    break;
                case 'gain':
                    calories = Math.round(tdee + 500); // 500 cal surplus
                    break;
            }

            // Calculate macros
            let protein, carbs, fat;
            
            if (diet === 'keto') {
                protein = Math.round((calories * 0.25) / 4);
                carbs = Math.round((calories * 0.05) / 4);
                fat = Math.round((calories * 0.70) / 9);
            } else {
                protein = Math.round((calories * 0.30) / 4);
                carbs = Math.round((calories * 0.40) / 4);
                fat = Math.round((calories * 0.30) / 9);
            }

            // Calculate water intake (35ml per kg of body weight)
            const waterIntake = Math.round((weight * 35) / 1000 * 10) / 10;

            // Display results
            document.getElementById('basic-info').innerHTML = `
                <h3>Hello ${name}! 👋</h3>
                <p><strong>BMR:</strong> ${Math.round(bmr)} calories/day</p>
                <p><strong>TDEE:</strong> ${Math.round(tdee)} calories/day</p>
                <p><strong>Goal:</strong> ${goal.charAt(0).toUpperCase() + goal.slice(1)} weight</p>
            `;

            document.getElementById('calories').textContent = calories;
            document.getElementById('protein').textContent = protein;
            document.getElementById('carbs').textContent = carbs;
            document.getElementById('fat').textContent = fat;
            document.getElementById('water').textContent = waterIntake + 'L';

            // Show results
            document.getElementById('results').style.display = 'block';
            
            // Generate meal plan
            generateMealPlan(calories, protein, carbs, fat, diet);
            
            // Show tips
            showTips(goal, diet);
            
            // Show IF timer if applicable
            if (diet === 'intermittent-fasting') {
                document.getElementById('if-timer').style.display = 'block';
            }
        }

        function generateMealPlan(calories, protein, carbs, fat, dietType) {
            const meals = getMealsByDiet(dietType, calories);
            
            let mealsHTML = '';
            meals.forEach(meal => {
                mealsHTML += `
                    <div class="meal-card">
                        <h3>${meal.name}</h3>
                        <div class="meal-items">
                            ${meal.items.map(item => `<div class="meal-item">${item}</div>`).join('')}
                        </div>
                    </div>
                `;
            });

            document.getElementById('meals').innerHTML = mealsHTML;
            document.getElementById('meal-plan').style.display = 'block';
        }

        function getMealsByDiet(dietType, calories) {
            const mealPlans = {
                'vegetarian': [
                    {
                        name: '🌅 Breakfast',
                        items: ['Oatmeal with berries (300 cal)', 'Greek yogurt (150 cal)', 'Almonds (100 cal)']
                    },
                    {
                        name: '🥗 Lunch',
                        items: ['Quinoa salad with vegetables (400 cal)', 'Hummus with pita (200 cal)', 'Fresh fruit (100 cal)']
                    },
                    {
                        name: '🍽️ Dinner',
                        items: ['Lentil curry with rice (450 cal)', 'Steamed vegetables (100 cal)', 'Chapati (150 cal)']
                    },
                    {
                        name: '🥜 Snacks',
                        items: ['Mixed nuts (150 cal)', 'Fruit smoothie (200 cal)']
                    }
                ],
                'vegan': [
                    {
                        name: '🌅 Breakfast',
                        items: ['Chia pudding with fruits (300 cal)', 'Almond milk smoothie (200 cal)', 'Walnuts (150 cal)']
                    },
                    {
                        name: '🥗 Lunch',
                        items: ['Buddha bowl with tofu (450 cal)', 'Avocado toast (250 cal)', 'Green tea (0 cal)']
                    },
                    {
                        name: '🍽️ Dinner',
                        items: ['Chickpea curry (400 cal)', 'Brown rice (200 cal)', 'Sautéed spinach (100 cal)']
                    },
                    {
                        name: '🥜 Snacks',
                        items: ['Dates and nuts (150 cal)', 'Vegetable smoothie (100 cal)']
                    }
                ],
                'keto': [
                    {
                        name: '🌅 Breakfast',
                        items: ['Eggs and bacon (400 cal)', 'Avocado (200 cal)', 'Bulletproof coffee (150 cal)']
                    },
                    {
                        name: '🥗 Lunch',
                        items: ['Grilled chicken salad (450 cal)', 'Olive oil dressing (100 cal)', 'Cheese (150 cal)']
                    },
                    {
                        name: '🍽️ Dinner',
                        items: ['Salmon with asparagus (500 cal)', 'Cauliflower rice (50 cal)', 'Butter (100 cal)']
                    },
                    {
                        name: '🥜 Snacks',
                        items: ['Macadamia nuts (200 cal)', 'Cheese cubes (100 cal)']
                    }
                ],
                'default': [
                    {
                        name: '🌅 Breakfast',
                        items: ['Oatmeal with fruits (300 cal)', 'Scrambled eggs (200 cal)', 'Orange juice (100 cal)']
                    },
                    {
                        name: '🥗 Lunch',
                        items: ['Grilled chicken breast (300 cal)', 'Quinoa salad (250 cal)', 'Steamed broccoli (50 cal)']
                    },
                    {
                        name: '🍽️ Dinner',
                        items: ['Baked fish (300 cal)', 'Sweet potato (150 cal)', 'Green beans (100 cal)']
                    },
                    {
                        name: '🥜 Snacks',
                        items: ['Greek yogurt (150 cal)', 'Apple with peanut butter (200 cal)']
                    }
                ]
            };

            return mealPlans[dietType] || mealPlans['default'];
        }

        function showTips(goal, diet) {
            const tips = [
                "💧 Drink at least 8 glasses of water daily - hydration is key to metabolism!",
                "😴 Prioritize 7-9 hours of quality sleep for optimal recovery and hormone balance.",
                "🚶‍♀️ Incorporate 30 minutes of daily movement, even if it's just a walk.",
                "🥗 Fill half your plate with vegetables at each meal for maximum nutrients.",
                "⏰ Eat meals at consistent times to regulate your metabolism.",
                "🧘‍♀️ Practice mindful eating - chew slowly and listen to hunger cues.",
                "📱 Set reminders for meals and water intake to stay on track.",
                "🏋️‍♀️ Combine cardio with strength training for best results.",
                "🍎 Prep healthy snacks in advance to avoid impulsive food choices.",
                "📊 Track your progress but don't obsess over daily weight fluctuations."
            ];

            const goalTips = {
                'lose': "🎯 Focus on creating a sustainable calorie deficit through diet and exercise.",
                'maintain': "⚖️ Listen to your body and adjust portions based on activity levels.",
                'gain': "💪 Eat frequent, nutrient-dense meals and prioritize protein for muscle growth."
            };

            const dietTips = {
                'vegetarian': "🌱 Ensure adequate B12, iron, and protein from diverse plant sources.",
                'vegan': "🥜 Include nuts, seeds, and legumes for complete amino acid profiles.",
                'keto': "🥑 Monitor ketone levels and ensure adequate electrolyte intake.",
                'intermittent-fasting': "⏰ Stay hydrated during fasting periods and don't overeat in eating windows."
            };

            let tipsHTML = '';
            tips.forEach(tip => {
                tipsHTML += `<div class="tip-item">${tip}</div>`;
            });

            if (goalTips[goal]) {
                tipsHTML += `<div class="tip-item"><strong>Goal-specific tip:</strong> ${goalTips[goal]}</div>`;
            }

            if (dietTips[diet]) {
                tipsHTML += `<div class="tip-item"><strong>Diet-specific tip:</strong> ${dietTips[diet]}</div>`;
            }

            document.getElementById('tips-content').innerHTML = tipsHTML;
            document.getElementById('tips').style.display = 'block';
        }

        function startFasting() {
            fastingStartTime = Date.now();
            fastingTimer = setInterval(updateTimer, 1000);
            document.querySelector('.timer-btn').textContent = 'Fasting...';
        }

        function stopFasting() {
            clearInterval(fastingTimer);
            document.getElementById('timer').textContent = '16:00:00';
            document.querySelector('.timer-btn').textContent = 'Start Fasting';
        }

        function updateTimer() {
            const elapsed = Math.floor((Date.now() - fastingStartTime) / 1000);
            const remaining = Math.max(0, fastingDuration - elapsed);
            
            const hours = Math.floor(remaining / 3600);
            const minutes = Math.floor((remaining % 3600) / 60);
            const seconds = remaining % 60;
            
            document.getElementById('timer').textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (remaining === 0) {
                clearInterval(fastingTimer);
                alert('🎉 Fasting period complete! You can now eat.');
                document.querySelector('.timer-btn').textContent = 'Start Fasting';
            }
        }

        function downloadPDF() {
            const name = document.getElementById('name').value || 'Your';
            const age = document.getElementById('age').value;
            const gender = document.getElementById('gender').value;
            const height = document.getElementById('height').value;
            const weight = document.getElementById('weight').value;
            const activity = document.getElementById('activity').selectedOptions[0].text;
            const goal = document.getElementById('goal').selectedOptions[0].text;
            const diet = document.getElementById('diet').selectedOptions[0].text;
            
            const calories = document.getElementById('calories').textContent;
            const protein = document.getElementById('protein').textContent;
            const carbs = document.getElementById('carbs').textContent;
            const fat = document.getElementById('fat').textContent;
            const water = document.getElementById('water').textContent;
            
            // Get meal plan content
            const mealCards = document.querySelectorAll('.meal-card');
            let mealPlanText = '';
            mealCards.forEach(card => {
                const mealName = card.querySelector('h3').textContent;
                const items = card.querySelectorAll('.meal-item');
                mealPlanText += `\n${mealName}\n`;
                items.forEach(item => {
                    mealPlanText += `  - ${item.textContent}\n`;
                });
            });
            
            // Get tips content
            const tipItems = document.querySelectorAll('.tip-item');
            let tipsText = '';
            tipItems.forEach(tip => {
                tipsText += `• ${tip.textContent}\n`;
            });
            
            const currentDate = new Date().toLocaleDateString();
            
            const pdfContent = `
🍎 ${name} PERSONALIZED DIET PLAN
=====================================
Generated on: ${currentDate}

PERSONAL INFORMATION:
• Name: ${name}
• Age: ${age} years
• Gender: ${gender}
• Height: ${height} cm
• Weight: ${weight} kg
• Activity Level: ${activity}
• Goal: ${goal}
• Diet Preference: ${diet}

DAILY NUTRITION TARGETS:
• Calories: ${calories}
• Protein: ${protein}g
• Carbohydrates: ${carbs}g
• Fat: ${fat}g
• Water: ${water}

SAMPLE MEAL PLAN:
${mealPlanText}

NUTRITION TIPS & REMINDERS:
${tipsText}

ADDITIONAL RECOMMENDATIONS:
• Eat meals at consistent times to regulate metabolism
• Practice portion control and mindful eating
• Stay hydrated throughout the day
• Get 7-9 hours of quality sleep
• Incorporate regular physical activity
• Monitor progress but don't obsess over daily fluctuations

Remember: This plan is a guideline. Listen to your body and adjust as needed.
Consult with a healthcare professional before making significant dietary changes.

Generated by Diet Calculator & Meal Planner
Visit us again for updates and support on your health journey!
            `;
            
            try {
                const blob = new Blob([pdfContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${name.replace(/\s+/g, '_')}_Diet_Plan_${currentDate.replace(/\//g, '-')}.txt`;
                
                // Ensure the link is added to the DOM for some browsers
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // Clean up
                setTimeout(() => URL.revokeObjectURL(url), 100);
                
                alert('📄 Your complete diet plan has been downloaded successfully! Keep it handy for reference.');
            } catch (error) {
                console.error('Download failed:', error);
                
                // Fallback: Display content in a new window for manual saving
                const newWindow = window.open('', '_blank');
                newWindow.document.write(`
                    <html>
                        <head>
                            <title>${name} Diet Plan</title>
                            <style>
                                body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                                h1 { color: #333; }
                                .section { margin: 20px 0; }
                            </style>
                        </head>
                        <body>
                            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${pdfContent}</pre>
                            <br><br>
                            <button onclick="window.print()">Print This Plan</button>
                        </body>
                    </html>
                `);
                newWindow.document.close();
                
                alert('📄 Your diet plan has opened in a new window. You can print or save it manually!');
            }
        }

        // Add some motivational alerts
        setInterval(() => {
            if (document.getElementById('results').style.display === 'block') {
                const motivationalMessages = [
                    "💪 Remember: Progress, not perfection!",
                    "🌟 You're doing great! Stay consistent!",
                    "💧 Time for a water break! Stay hydrated!",
                    "🏃‍♀️ How about a quick walk? Movement is medicine!",
                    "🥗 Fuel your body with nutritious foods!"
                ];
                
                if (Math.random() < 0.1) { // 10% chance every 30 seconds
                    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
                    setTimeout(() => alert(randomMessage), 1000);
                }
            }
        }, 30000); // Check every 30 seconds